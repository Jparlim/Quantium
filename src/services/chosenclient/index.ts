import { FastifyReply, FastifyRequest } from "fastify"
import prisma from "../../db"
import { includes, string } from "zod"

interface ChosenInterface {
    [nameSpace: string]: {}
}

const teste:ChosenInterface[] = []

function Format(nameSpace:string, type: string | number, condition: boolean) {
    const data:ChosenInterface = {}

    if(condition) {        
            data[nameSpace] = { type: type.toString().toUpperCase()}
            teste.push(data)
            return teste;
    }
    return {message: "condition desabilited"}
}

export function ChosenClient(request:FastifyRequest, reply:FastifyReply) {
    const { nome, tipo, condition } = request.body as { nome:string, tipo: string | number, condition: boolean}

    const data = Format(nome, tipo, condition)

    return reply.send(data)
}