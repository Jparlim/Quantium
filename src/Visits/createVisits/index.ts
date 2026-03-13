import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";
import { connect } from "http2";

export async function CreateVisits(request:FastifyRequest, reply:FastifyReply) {
    const { Nome,
        numero,
        endereco, 
        observacao, 
        responsavel, 
        data, 
        hora, 
        status,
    } = request.body as { 
        Nome: string,
        numero: string,
        endereco: string, 
        observacao: string, 
        responsavel: string, 
        data: Date, 
        hora: string, 
        status: boolean,
        clientId: number
    }

    const numberFormated = numero.replace(/\D/g, '');

    const verifyClient = await prisma.cliente.findUnique({
        where: {
            nome: Nome,
            contato: numberFormated
        }
    })

    

    // problema: pegar o id do cliente para colocar no visits

    await prisma.visits.create({
        data: {
            client: { connect: {id: verifyClient?.id! }},
            nome: Nome,
            contato: numberFormated,
            endereco: endereco, 
            observacao: observacao,
            responsavel: responsavel,
            data: data,
            hora: hora,
            status: status,
        }
    })
}