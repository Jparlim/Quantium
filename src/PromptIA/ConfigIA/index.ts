import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../Prisma_Client";

export async function ChosenClient(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
    const {Empresa, NameIA, Instruction, DataName, DataType, TextTitle=null, Text=null} = 
    request.body as 
    { Empresa:string, NameIA:string, Instruction:string, DataName:string, DataType: string | number, TextTitle:string, Text:string }

    // const token = request.cookies.token as string
    // const decode = App.jwt.verify(token) as { IDcompany: number };

    try {
        await request.jwtVerify();
        const { IDcompany } = request.user as { IDcompany:number };

        // aqui pego o id da empresa que esta no navegador, await request.jwtVerify() decodifica o token quando o usuario entra nesta página, e fornece o valor dentro do token;

        const data = {
            ["nome"]: {type: "STRING"},
            [DataName]: {type: [DataType]}
        }

        if(TextTitle || Text !== null) {
            const text = {
                title: TextTitle,
                txt: Text
            }

            // cria banco de dados somente para os textos prontos
        }

        await prisma.iA.create({
            data: {
                company: {
                    connect: {id: IDcompany}
                },
                nomeEmpresa: Empresa,
                nomeIA: NameIA,
                instructions: Instruction,
                data: data
            }
        })

        return reply.status(200).send("configurações criadas com sucesso!")
    } catch(error) {
        return reply.send(error)
    }
}