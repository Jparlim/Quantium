import { FastifyReply, FastifyRequest } from "fastify";

export async function CreateClient(request: FastifyRequest, reply: FastifyReply) {
    const { companyId, nome, contato, data, status } = request.body as { companyId: number, nome: string, numero: string, endereco: string, contato: string, data: Date, status: boolean }

    
}