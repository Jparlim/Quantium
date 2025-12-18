import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";
import crypto from "crypto"

export async function Token(request:FastifyRequest, reply:FastifyReply) {
    const { token } = request.body as { token:string }

    const verify = await prisma.company_Pending.findFirst({
        where: {
            token: token
        }
    })

    if(verify?.created_at! < verify?.token_expires!) {
        return reply.send({
            message: "token expirou! tente novamente"
        })
    }

    if(token != verify?.token){
        reply.send({
            message: "token inválido! outro token será enviado para seu email!"
        })
        
        const tokenSend = crypto.randomInt(100000, 1000000).toString()
        return reply.send(tokenSend)
    }
    
    await prisma.company.create({
        data: {
            nomeEmpresa: verify?.nome!,
            email: verify?.email!,
            senha: verify?.senha!,
            CNPJ: verify?.CNPJ!,
            numero: verify?.numero!,
            status: true
        }
    })
}