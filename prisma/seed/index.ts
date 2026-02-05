import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function Main() {
    await prisma.company.createMany({
        data: [
            {
                nomeEmpresa: "Joao pintura",
                email: "joaoteste@gmail.com",
                senha: "12345",
                CNPJ: "11111111",
                numero: "4399999-9999",
                status: true,
                saldo: 0
            }
        ]
    })

    await prisma.iA.createMany({
        data: [
            {
                companyId: 1,
                nomeEmpresa: "Joao pintura",
                nomeIA: "Ana",
                instructions: "responda as perguntas do cliente e n faça muitas perguntas",
                data: {
                    nome: "string",
                    idade: "number"
                }
            }
        ]
    })

    await prisma.cliente.createMany({
        data: [
            {
                companyId: 1,
                nome: "jeferson",
                contato: "4399988-7755",
                data: "2026-02-05",
                status: true
            }
        ]
    })

    await prisma.visits.createMany({
        data: [
            {
                clientId: 1,
                nome: "Jeferson",
                endereco: "rua cristovao colombo 123",
                observacao: "perto da igreja la",
                responsavel: "pedro",
                data: "2026-03-01",
                hora: "15:30",
                status: true
            }
        ]
    })

    console.log("seed rodou com sucesso!")
}

Main()
.catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });