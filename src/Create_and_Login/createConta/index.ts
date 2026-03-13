import crypto from "crypto"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../../Prisma_Client";
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config();

export async function CriaConta(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
    const { nome, email, senha, CNPJ, numero } = request.body as { nome:string, email: string, senha: string, CNPJ: string, numero: string }

    // usar a AWS SES e configurar
    const tokenSend = crypto.randomInt(100000, 1000000).toString()

    const verify = await prisma.company.findFirst({
        where: {
            OR: [
                {nomeEmpresa: nome},
                {email: email},
                {CNPJ: CNPJ},
                {numero: numero}
            ]
        }
    })

    if(verify) {
        return reply.status(400).send({
            message: 'empresa já cadastrada!'
        })
    }

    const hashSenha = await bcrypt.hash(senha, 10)

    const Id_pending = await prisma.company_Pending.create({
        data: {
            nome: nome,
            email: email,
            senha: hashSenha,
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

    const token = App.jwt.sign(
    {
        id: Id_pending.id,
        token: tokenSend,
    }, 
    {
        expiresIn: "5m"
    })

    console.log(tokenSend)

    // mudar o secure, pois estou rodando local o servidor, e precisa rodar HTTPS

    return reply.setCookie("tokenVerify", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 5
    }).send({ success:true })
}