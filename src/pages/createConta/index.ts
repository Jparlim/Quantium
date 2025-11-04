import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../db";

export async function CriaConta(request:FastifyRequest, reply:FastifyReply) {
    const { nome, email, senha, CNPJ, token, numero } = request.body as { nome:string, email: string, senha: string, CNPJ: number, token: string, numero: number }

    await prisma.company.create({
        data: {
            nomeEmpresa: nome,
            email: email,
            senha: senha,
            CNPJ: CNPJ,
            token: token,
            numero: numero
        }
    })
}