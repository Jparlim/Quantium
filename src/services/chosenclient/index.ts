import { FastifyReply, FastifyRequest } from "fastify"
import prisma from "../../db"

export async function ChosenClient(request:FastifyRequest, reply:FastifyReply) {
    const {Empresa, NameIA, Instruction, DataName, DataType, TextTitle, Text} = request.body as { Empresa:string, NameIA:string, Instruction:string, DataName:string, DataType: string | number, TextTitle:string, Text:string }
    const { companyId } = request.body as { companyId:number }
    //   const { companyId } = request.?user;
    //   vai chegar do JWT o id da empresa no banco

    const data = {
        [DataName]: {type: [DataType]}
    }

    const text = {
        title: TextTitle,
        txt: Text
    }

    // cria banco de dados somente para os textos prontos
    
    try {
        await prisma.iA.create({
            data: {
                company: {
                    connect: {id: companyId}
                },
                nomeEmpresa: Empresa,
                nomeIA: NameIA,
                instructions: Instruction,
                data: data
            }
        })

        return reply.send("configurações criadas com sucesso!")
    } catch(error) {
        return reply.send(error)
    }
}