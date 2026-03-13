import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Redis from "ioredis";
import { prisma } from "../../Prisma_Client";
import { CreateClient } from "../../Clients/createClient";
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
})

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function System(idEmpresa:number, clientNumber:string, messageClient:string) {
    const userMessage = {
        role: "user",
        parts: [messageClient]
    }

    try {
        await redis.rpush(clientNumber, JSON.stringify(userMessage))
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
            contents: await redis.lrange(clientNumber, 0,-1),
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

        console.log(JSON.parse(resposta.text as string)[0].dataClient);

        const dataClient = JSON.parse(resposta.text as string)[0].dataClient

        const verify = await prisma.cliente.findFirst({
            where: {
                OR: [
                    {nome: dataClient.nomeClient},
                    {contato: clientNumber}
                ]
            }
        })

        if(!verify) {
            if(dataClient.nomeClient) {
                CreateClient(idEmpresa, dataClient.nome, clientNumber, true);
            }
        }

        await redis.rpush(clientNumber, JSON.stringify(resposta.text));
    
        return resposta;
    } catch(error) {
        console.log(error)
    }
}