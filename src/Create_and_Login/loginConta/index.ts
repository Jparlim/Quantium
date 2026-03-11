import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import {prisma} from "../../Prisma_Client";
import bcrypt from "bcrypt"

export async function Login(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
    const { email, senha } = request.body as { email:string, senha:string }

    
    const data = await prisma.company.findUnique({
        where: {
            email: email
        }
    })

    const senhaVerify = bcrypt.compare(senha, data?.senha as string)

    if(!senhaVerify) {
        return reply.status(400).send({message: "No account was found with that data"})
    }

    const token = App.jwt.sign({
        IDcompany: data?.id
    })

    console.log('account was found! wellcome to back')
    
    return reply.setCookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15
    }).send({ success: true })
}