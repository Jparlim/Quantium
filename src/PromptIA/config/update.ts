import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function UpdateConfigIA(request:FastifyRequest, reply: FastifyReply) {
    
    const { NameIA, Instruction } = request.body as { NameIA:string, Instruction:string };

    const Data:any = {}

    if(NameIA !== undefined) Data.NameIA = NameIA
    if(Instruction !== undefined) Data.Instruction = Instruction

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
            nomeIA: Data.NameIA,
            instructions: Data.Instruction
        }
    })

    return reply.status(200).send("configurações atualizadas com sucesso!")
}