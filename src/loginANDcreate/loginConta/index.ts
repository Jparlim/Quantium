import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../db";
import jwt from "@fastify/jwt"

export async function Loign(request:FastifyRequest, reply:FastifyReply) {
    const { email, senha } = request.body as { email:string, senha:string }

    const data = await prisma.company.findUnique({
        where: {
            email: email,
            AND: {
                senha: senha
            }
        }
    })

    if(!data) {
        return reply.send("Email ou Senha inválida!")
    }

    return await 
}