import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client/index.js";

export async function GetDatas( request:FastifyRequest, reply:FastifyReply, App:FastifyInstance ) {
    const token = request.cookies.refreshToken as string;

    if(!token) return reply.status(401).send({ message: "token não encontrado!" })

    const decode = App.jwt.verify(token) as { IDcompany: number };

    console.log(decode.IDcompany)

    const data = await prisma.iA.findUnique({
        where: {
            companyId: decode.IDcompany
        }
    })

    console.log(data)

    return reply.send(data);
}