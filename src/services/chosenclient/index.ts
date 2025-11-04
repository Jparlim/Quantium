import { Type } from "@google/genai"
import { FastifyReply, FastifyRequest } from "fastify"
import { System } from "../config"

export async function ChosenClient(request:FastifyRequest, reply:FastifyReply) {
  const {Empresa, NameIA, Instruction, DataName, DataType, TextTitle, Text} = 
  request.body as { Empresa:string, NameIA:string, Instruction:string, DataName:string, DataType: string | number, TextTitle:string, Text:string }
    
    const data = {
        [DataName]: {type: Type[(DataType) as keyof typeof Type]}
    }

    const text = {
        title: TextTitle,
        txt: Text
    }
    // salvar tudo no banco

    reply.send("ok!")
    return console.log(text)
    System(Empresa, NameIA, Instruction, data)
}