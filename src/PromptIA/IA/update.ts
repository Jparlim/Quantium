import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function UpdateConfigIA(request:FastifyRequest, reply: FastifyReply, App:FastifyInstance) {
    
    const { NameIA, Instruction } = request.body as { NameIA:string, Instruction:string };

    const token =  request.cookies.token as string;

    if(!token) return reply.status(401).send({ message: "token não encontrado!" })

    // const decode = App.jwt.verify(token) as { IDcompany: number };

    const { IDcompany } = request.user as { IDcompany:number };


    const companyWithConfig = await prisma.company.findUnique({
        where: { 
            id: IDcompany 
        },
        include: { 
            IA: true 
        }
    })

    await prisma.iA.update({
        where: {
            id: companyWithConfig?.IA[0].id!
        },
        data: {
            nomeIA: NameIA,
            instructions: Instruction
        }
    })

    return reply.status(200).send("configurações atualizadas com sucesso!")
}