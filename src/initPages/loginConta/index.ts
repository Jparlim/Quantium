import { FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../../Prisma_Client";

export async function Login(request:FastifyRequest, reply:FastifyReply) {
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

    console.log('account was found! wellcome to back')
    return reply.status(200).send('account was found! wellcome to back')
}