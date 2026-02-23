import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../Prisma_Client";

export async function ChosenClient(request:FastifyRequest, reply:FastifyReply) {
    const {Empresa, NameIA, Instruction, DataName, DataType, TextTitle, Text} = 
    request.body as 
    { Empresa:string, NameIA:string, Instruction:string, DataName:string, DataType: string | number, TextTitle:string, Text:string }

    try {
        await request.jwtVerify();
        const { companyId } = request.user as { companyId:number};

        // aqui pego o id da empresa que esta no navegador, await request.jwtVerify() decodifica o token quando o usuario entra nesta página, e fornece o valor dentro do token

        const data = {
            ["nomeClient"]: {type: "STRING"},
            [DataName]: {type: [DataType]}
        }

        const text = {
            title: TextTitle,
            txt: Text
        }

    // cria banco de dados somente para os textos prontos
    
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