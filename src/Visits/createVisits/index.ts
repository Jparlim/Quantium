import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../Prisma_Client";

export async function CreateVisits(request:FastifyRequest, reply:FastifyReply) {
    const { nome,
        numero,
        endereco, 
        observacao, 
        responsavel, 
        data, 
        hora, 
        status,
        clientId,
    } = request.body as { 
        nome: string,
        numero: string,
        endereco: string, 
        observacao: string, 
        responsavel: string, 
        data: Date, 
        hora: string, 
        status: boolean,
        clientId: number
    }

    // problema: pegar o id do cliente para colocar no visits

    await prisma.visits.create({
        data: {
            nome: nome,
            contato: numero,
            endereco: endereco, 
            observacao: observacao,
            responsavel: responsavel,
            data: data,
            hora: hora,
            status: status,
            clientId: clientId
        }
    })
}