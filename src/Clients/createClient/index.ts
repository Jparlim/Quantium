import { prisma } from "../../Prisma_Client";

export async function CreateClient( companyId:number, dados:{"nome": string}, Contato:string ) {
    await prisma.cliente.create({
        data: {
            company: {
                connect: { id: companyId}
            },
            nome: dados.nome,
            data: dados,
            contato: Contato,
            status: true
        }
    })

    return console.log(companyId, dados, Contato, {message: "cliente criado com sucesso!"})
}