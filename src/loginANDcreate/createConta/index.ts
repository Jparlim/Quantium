import crypto from "crypto"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../../Prisma_Client";
import dotenv from "dotenv"
dotenv.config()

export async function CriaConta(App:FastifyInstance, request:FastifyRequest, reply:FastifyReply) {
    const { nome, email, senha, CNPJ, numero } = request.body as { nome:string, email: string, senha: string, CNPJ: string, numero: string }

    // usar a AWS SES e configurar
    const tokenSend = crypto.randomInt(100000, 1000000).toString()

    await prisma.company_Pending.create({
        data: {
            nome: nome,
            email: email,
            senha: senha,
            CNPJ: CNPJ,
            numero: numero,
            token: tokenSend,
            token_expires: new Date(
                 new Date()
                 .getTime()
                 + 15 * 60 * 1000
            )
        }
    })
}