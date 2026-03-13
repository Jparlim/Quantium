import { prisma } from "../../Prisma_Client";

export async function CreateClient( companyId:number, Nome:string, Contato:string ) {
    await prisma.cliente.create({
        data: {
            company: {
                connect: { id: companyId}
            },
            nome: Nome,
            contato: Contato,
            status: true
        }
    })

    return console.log(companyId, Nome, Contato, status, {message: "cliente criado com sucesso!"})
}