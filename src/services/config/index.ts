import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
})

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function System(Empresa:string, NameIA:string, Instruction:string, Data:object) {
    
    const resposta = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: await redis.get(),
        config: {
        responseMimeType: "application/json",
        systemInstruction: `você é uma atendente da empresa ${Empresa} e seu nome é ${NameIA}, ${Instruction}`,
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    resposta: {type: Type.STRING},
                    dataClient: {
                        type: Type.OBJECT,
                        properties: Data
                    },
                },
                propertyOrdering: ["resposta", "dataClient"],
            },
        },
        },
    })

    

    // client: {type: STRING},
}