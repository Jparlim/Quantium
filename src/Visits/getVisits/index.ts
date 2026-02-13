import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function GetVisits(request: FastifyRequest, reply: FastifyReply) {
    const { date } = request.params as { date: Date}

    return await prisma.visits.findMany({
        where: {
            data: date
        }
    })
}