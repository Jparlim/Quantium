import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Redis from "ioredis";
import prisma from "../../db";
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
})

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function System(numberClient:number, messageClient:string, empresaNumber:number) {

    const format = {
        
    }

    const company = await prisma.company.findUnique({
        where: {
            numero: empresaNumber
        }
    })

    const datas = await prisma.iA.findMany({
        where: {
            id: company?.id
        }
    })
    
    const resposta = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: ,
        config: {
        responseMimeType: "application/json",
        systemInstruction: `você é uma atendente da empresa ${datas[0].nomeEmpresa} e seu nome é ${datas[0].nomeIA}, ${datas[0].instructions}`,
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    resposta: {type: Type.STRING},
                    dataClient: {
                        type: Type.OBJECT,
                        properties: datas[0].data
                    },
                },
                propertyOrdering: ["resposta", "dataClient"],
            },
        },
        },
    })

    

    // client: {type: STRING},
}