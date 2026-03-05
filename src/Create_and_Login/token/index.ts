import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";
import dotenv from "dotenv";
import crypto from "crypto"
import { success } from "zod";
dotenv.config();


export async function Token(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
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
    
    const IdCount = await prisma.company.create({
        data: {
            nomeEmpresa: verify?.nome!,
            email: verify?.email!,
            senha: verify?.senha!,
            CNPJ: verify?.CNPJ!,
            numero: verify?.numero!,
            status: true
        }
    })

    // salvar o id da conta da empresa no 

    await prisma.company_Pending.delete({
        where: {
            id: verify.id
        }
    })

    const tokenJwt = App.jwt.sign(
        { IDcompany: IdCount.id },
        { expiresIn: "15m" },
    )

    const refreshTokenJwt = App.jwt.sign(
        { IDcompany: IdCount.id },
        { expiresIn: "7d" }
    )

    console.log(tokenJwt);

    return reply
    .setCookie("token", tokenJwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: '/',
        maxAge: 60 * 15
    })
    .setCookie("refreshToken", refreshTokenJwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    }).send({ success:true})
}