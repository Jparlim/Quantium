import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";
import dotenv from "dotenv";
import crypto from "crypto"
dotenv.config();


export async function Token(request:FastifyRequest, reply:FastifyReply, App:FastifyInstance) {
    const { token } = request.body as any
    const tokenCookie = request.cookies.verifyToken as string
    
    console.log(tokenCookie)

    if(!tokenCookie) return reply.status(401).send({ message: "token não encontrado!" })
    
    const decode = App.jwt.verify(tokenCookie) as { id: number, token: string }

    const verify = await prisma.company_Pending.findUnique({
        where: {
            id: decode.id,
        }
    })

    if(!verify) return `${reply.status(401).send("Ocorreu um erro! empresa não foi encontrada!")}`

    if(token != verify?.token){
        const tokenSend = crypto.randomInt(100000, 1000000).toString()

        await prisma.company_Pending.update({
            where: {
                id: decode.id
            },
            data: {
                token: tokenSend
            }
        })

        return reply.send({ message: "token inválido, outro token será enviado para o email inserido!", token: tokenSend})
    }

    if(verify?.created_at! > verify?.token_expires!) {

        const tokenSend = crypto.randomInt(100000, 1000000).toString()

        await prisma.company_Pending.update({
            where: {
                id: decode.id
            },
            data: {
                token: tokenSend
            }
        })
        
        return reply.send({
            message: "token expirou! outro token será enviado para seu email",
            token: tokenSend
        })
        // enviar token para email
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
        secure: process.env.NODE_ENV === "production",
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