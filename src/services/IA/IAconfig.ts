import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { FastifyReply, FastifyRequest } from "fastify";
import { ChosenClient } from "../chosenclient";
import { ClientList } from "../clientList";

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

interface teste {
    role: "user" | "model",
    text: string,
}

interface memoryType {
    [userId: string]: teste[]
}

const Memory: memoryType = {}

export function IAconfig(request:FastifyRequest, reply: FastifyReply) {    
    const Sistem = async () => {
        const { Body, From } = request.body as { Body: string, From: string}
      
        if(!Memory[From]) {
            Memory[From] = []
        }

        Memory[From].push({
            role: "user",
            text: Body,
        })

        const textIA = Memory[From].slice(-10).map(m => ({
            role: m.role,
            parts: [{ text: m.text}]
        }))
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textIA,
            config: {
            responseMimeType: "application/json",
            systemInstruction: `você é uma atendente da empresa joao moreira pinturas e reparos, seu dever é atender o cliente da melhor forma,
                converse com eles da melhor forma, sem texto muito grande, poucas perguntas e ao longo da conversa, tente saber o nome dele, serviço desejado, tente sempre extrair informações como nome, 
                serviço, tinta, local e moradia, moradia seria a casa, apartamento ou outro dipo de moradia que exista`,
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        resposta: {type: Type.STRING},
                        dataClient: {
                            type: Type.OBJECT,
                            properties: {
                                client: {type: Type.STRING},
                                service: {type: Type.STRING},
                                tinta: {type: Type.STRING},
                                local: {type: Type.STRING},
                                moradia: {type: Type.STRING},
                            }
                        },
                    },
                    propertyOrdering: ["resposta", "dataClient"],
                },
            },
            },
        })

        const data = response.candidates?.[0]?.content?.parts?.[0].text ?? ""

        interface dataInterface {
            resposta: string,
            dataClient: object,
        }

        try {
            if(response.text) {
                const txt = JSON.parse(data);

                const withRole = txt.map((item:dataInterface) => ({
                    role: "model",
                    text: item.resposta
                }))

                Memory[From].push(withRole[0])
                
                // reply.send(txt[0].dataClient)
                // reply.send(withRole[0].text)
            }
        } catch( error ) {
            reply.send(error)
        }
    }

    Sistem();
}