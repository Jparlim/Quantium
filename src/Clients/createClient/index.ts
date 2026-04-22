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

<<<<<<< HEAD
    return console.log(companyId, dados, Contato, {message: "cliente criado com sucesso!"});
=======
    return console.log(companyId, dados, Contato, {message: "cliente criado com sucesso!"})
>>>>>>> eb6fdd44d7abfd164ae6eb132f852688f128b245
}