import { FastifyReply, FastifyRequest } from "fastify";
import {prisma} from "../Prisma_Client";
import { System } from "../PromptIA/config";

export async function whatsapp(request:FastifyRequest, reply: FastifyReply) {    
    // const { entry } = request.body as { entry:Array<object>}

    // const empresaNumber = entry[0].changes[0].value.metadata.phone_number
    // const clientNumber = entry[0].changes[0].value.messages[0].from
    // const messgaeClient = entry[0].changes[0].value.messages[0].text

// {
//   "object": "whatsapp_business_account",
//   "entry": [
//     {
//       "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
//       "changes": [
//         {
//           "value": {
//             "messaging_product": "whatsapp",
//             "metadata": {
//               "display_phone_number": "5511999999999", Empresa
//               "phone_number_id": "123456789012345"
//             },
//             "contacts": [
//               {
//                 "profile": {
//                   "name": "Cliente Exemplo"
//                 },
//                 "wa_id": "5511888888888"
//               }
//             ],
//             "messages": [
//               {
//                 "from": "5511888888888", Cliente
//                 "id": "wamid.HBgMNTUxMTg4ODg4ODg4FQIAERgSOTkzODIxNkJDNzZBRjRGNkZC",
//                 "timestamp": "1730642174",
//                 "text": {
//                   "body": "Olá, tudo bem?" message cliente
//                 },
//                 "type": "text"
//               }
//             ]
//           },
//           "field": "messages"
//         }
//       ]
//     }
//   ]
// }

// este código acima é um exemploq de como vou receber a estrutura de dados quando eu implementar o Whatsapp meta

    const {empresaNumber, clientNumber, messgaeClient } = request.body as { empresaNumber: string, clientNumber: string, messgaeClient: string};

    // await request.jwtVerify();
    // const { IDcompany } = request.user as { IDcompany: number } 

    // const Idcompany = await prisma.company.findUnique({
    //     where: {
    //         numero: empresaNumber, 
    //         AND: {
    //             id: IDcompany
    //         }
    //     }
    // })

    const Idcompany = await prisma.company.findUnique({
        where: {
            numero: empresaNumber
        }
    })

    if(!Idcompany) {
        return reply.status(404).send("empresa não encontrada no banco!")
    }

    const resposta = await System(Idcompany?.id!, clientNumber, messgaeClient)

    const exists = await prisma.cliente.findUnique({
        where: {
            contato: clientNumber
        }
    })

    if(!exists && resposta?.data) {
        await prisma.cliente.create({
            data: {
                contato: clientNumber,
                company: {
                    connect: { id: Idcompany?.id}
                }    
            }
        })
    }

    reply.send(JSON.parse(resposta?.text as string)[0].resposta)
}