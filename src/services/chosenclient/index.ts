import { Type } from "@google/genai"
import { FastifyReply, FastifyRequest } from "fastify"
import { System } from "../config"
import prisma from "../../db"

export async function ChosenClient(request:FastifyRequest, reply:FastifyReply) {
  const {Empresa, NameIA, Instruction, DataName, DataType, TextTitle, Text} = request.body as { Empresa:string, NameIA:string, Instruction:string, DataName:string, DataType: string | number, TextTitle:string, Text:string }
  const { companyId } = request.?user;
//   vai chegar do JWT o id da empresa no banco
    
    const data = {
        [DataName]: {type: Type[(DataType) as keyof typeof Type]}
    }

    const text = {
        title: TextTitle,
        txt: Text
    }

    // cria banco de dados somente para os textos prontos
    
    await prisma.iA.create({
        data: {
            company: companyId,
            nomeEmpresa: Empresa,
            nomeIA: NameIA,
            instructions: Instruction,
            data: data
        }
    })

    
}