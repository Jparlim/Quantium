import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function UpdateConfigIA(request:FastifyRequest, reply: FastifyReply) {
    
    const { NameIA, Instruction } = request.body as { NameIA:string, Instruction:string };

    await request.jwtVerify();
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