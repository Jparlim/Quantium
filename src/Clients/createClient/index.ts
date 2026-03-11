import { FastifyReply, FastifyRequest } from "fastify";

export async function CreateClient( companyId:number, nome:string, contato:string, status:boolean ) {

    return console.log(companyId, nome, contato, status)
}