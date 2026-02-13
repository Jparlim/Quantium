import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Redis from "ioredis";
import { prisma } from "../../Prisma_Client";
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

        console.log("inserindo a mensagem do cliente")
        console.log(await redis.lrange(clientNumber, 0,-1))

        const datas = await prisma.iA.findMany({
            where: {
                id: idEmpresa
            }
        })
    
        const resposta = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: await redis.lrange(clientNumber, 0,-1),
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

        await redis.rpush(clientNumber, JSON.stringify(resposta.text))

        return resposta;
    } catch(error) {
        console.log(error)
    }
}