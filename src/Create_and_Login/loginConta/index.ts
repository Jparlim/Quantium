import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import {prisma} from "../../Prisma_Client";
import { success } from "zod";

export async function Login(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
    const { email, senha } = request.body as { email:string, senha:string }

    const data = await prisma.company.findUnique({
        where: {
            email: email,
            senha: senha
        }
    })

    if(!data) {
        console.log('teste de dados erraDOS')
        return reply.status(400).send({message: "No account was found with that data"})
    }

    const token = App.jwt.sign({
        IDcompany: data.id
    })

    console.log('account was found! wellcome to back')
    
    return reply.setCookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15
    }).send({ success: true })
}