import { prisma } from "../../Prisma_Client";

export async function CreateClient( companyId:number, dados:object, Contato:string ) {
    await prisma.cliente.create({
        data: {
            company: {
                connect: { id: companyId}
            },
            data: dados,
            contato: Contato,
            status: true
        }
    })

    return console.log(companyId, dados, Contato, status, {message: "cliente criado com sucesso!"})
}