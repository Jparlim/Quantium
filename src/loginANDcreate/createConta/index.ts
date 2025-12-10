import crypto from "crypto"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../db";
import dotenv from "dotenv"
dotenv.config()

export async function CriaConta(App:FastifyInstance, request:FastifyRequest, reply:FastifyReply) {
    const { nome, email, senha, CNPJ, token, numero } = request.body as { nome:string, email: string, senha: string, CNPJ: string, token: string, numero: string }

    // usar a AWS SES e configurar
    const tokenSend = 100000 + Math.random() + 900000

    reply.send({
        message: `token de acesso: ${tokenSend}`,
        tokenSend
    })
    console.log("dados passaram pro if")

    if(Number(token) === tokenSend) {
        const empresa = await prisma.company.create({
            data: {
                nomeEmpresa: nome,
                email: email,
                senha: senha,
                CNPJ: CNPJ,
                token: token,
                numero: numero
            }
        })

        App.jwt.sign(empresa.id.toString())
        return reply.send("conta criada com sucesso!")
    }

    // return reply.send("token inválido!")
}