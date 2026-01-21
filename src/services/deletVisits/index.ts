import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function DeleteVisits(request:FastifyRequest, reply:FastifyReply) {
    const { Id } = request.params as { Id: number };

    try {
        await prisma.visits.delete({
            where: {
                id: Id
            }
        });
        return reply.status(200).send({ message: "Visit deleted successfully" });
    } catch (error) {
        console.error("Error deleting visit:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}