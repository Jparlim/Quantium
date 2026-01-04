import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";
import crypto from "crypto"

export async function Token(request:FastifyRequest, reply:FastifyReply) {
    const { token, idPending } = request.body as { token:string, idPending:number }

    const verify = await prisma.company_Pending.findUnique({
        where: {
            id: Number(idPending),
            token: token
        }
    })

    if(!verify) return `${reply.status(501).send("Ocorreu um erro! id da empresa não foi encontrado!")}`

    if(token != verify?.token){
        reply.send({
            message: "token inválido! outro token será enviado para seu email!"
        })


        const tokenSend = crypto.randomInt(100000, 1000000).toString()

        await prisma.company_Pending.update({
            where: {
                id: idPending
            },
            data: {
                token: tokenSend
            }
        })

        return reply.send(tokenSend)
        // deixar mais minimalista o código, colocar direto no data o token, estou usando agora apenas por que ainda não configurei o envio de emails
    }

    if(verify?.created_at! > verify?.token_expires!) {
        return reply.send({
            message: "token expirou! tente novamente"
        })
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

    await prisma.company_Pending.delete({
        where: {
            id: verify.id
        }
    })

    return reply.status(201).send("empresa criada na tabela company!")
}