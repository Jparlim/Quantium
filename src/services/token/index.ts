import { randomInt } from "crypto"
import { FastifyReply, FastifyRequest } from "fastify";

export async function Token(request:FastifyRequest, reply:FastifyReply) {
    const tokenSend = randomInt(0, 1_000_000);

    reply.send({
        message: `token de acesso: ${tokenSend.toString().padStart(6, "0")}`,
        tokenSend
    })
}