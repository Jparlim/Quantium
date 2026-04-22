import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { prisma } from "../../Prisma_Client/index.js";
import { CreateClient } from "../../Clients/createClient/index.js";
import { client as redis } from "../../../Redis/controller.js";
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function System(idEmpresa:number, clientNumber:string, messageClient:string) {
    const userMessage = {
        role: "user",
        parts: [messageClient]
    }

    try {
        await redis.rPush(clientNumber, JSON.stringify(userMessage))
        await redis.expire(clientNumber, 3600 * 1)

        const datas = await prisma.iA.findFirst({
            where: {
                companyId: idEmpresa
            }
        })

        if(!datas) {
            console.log("configuração de IA não foi encontrada para esta empresa! a IA continuará sem configurações personalizadas.");
        }
    
        const resposta = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: await redis.lRange(clientNumber, 0,-1) as string[],
            config: {
            responseMimeType: "application/json",
            systemInstruction: `você é uma atendente da empresa ${datas?.nomeEmpresa} e seu nome é ${datas?.nomeIA}, ${datas?.instructions}. ${datas?.data} você precisa extrair estes dados do cliente, e retornar em formato JSON, seguindo a estrutura definida no schema. caso o cliente não forneça os dados necessários, retorne apenas a resposta para o cliente, sem o campo dataClient.`,
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        resposta: {type: Type.STRING},
                        dataClient: {
                            type: Type.OBJECT,
                            properties: datas?.data
                        },
                    },
                    propertyOrdering: ["resposta", "dataClient"],
                },
            },
            },
        })

        const verify = await prisma.cliente.findFirst({
            where: {
                contato: clientNumber
            }
        })

        const dataClient = JSON.parse(resposta.text as string)[0].dataClient

        if(dataClient){
            if(!verify) {
                CreateClient(idEmpresa, dataClient, clientNumber);
            }
        }

        await redis.rpush(clientNumber, JSON.stringify(resposta.text));
    
        return resposta;
    } catch(error) {
        console.log(error)
    }
}