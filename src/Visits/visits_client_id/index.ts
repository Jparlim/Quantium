import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function Visits_Client_id(request: FastifyRequest, reply: FastifyReply) {
    const { numberClient } = request.body as { numberClient: string }

    const data = await prisma.cliente.findUnique({
        where: {
            contato: numberClient
        }
    })

    return {
        id: data?.id
    };
}