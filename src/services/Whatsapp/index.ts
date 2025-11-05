import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../db";
import { System } from "../config";


export async function IAconfig(request:FastifyRequest, reply: FastifyReply) {    
//     const { entry } = request.body as { entry:Array<object>}

//     const empresaNumber = entry[0].changes[0].value.metadata.phone_number
//     const clientNumber = entry[0].changes[0].value.messages[0].from
//     const messgaeClient = entry[0].changes[0].value.messages[0].text

// // {
// //   "object": "whatsapp_business_account",
// //   "entry": [
// //     {
// //       "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
// //       "changes": [
// //         {
// //           "value": {
// //             "messaging_product": "whatsapp",
// //             "metadata": {
// //               "display_phone_number": "5511999999999", Empresa
// //               "phone_number_id": "123456789012345"
// //             },
// //             "contacts": [
// //               {
// //                 "profile": {
// //                   "name": "Cliente Exemplo"
// //                 },
// //                 "wa_id": "5511888888888"
// //               }
// //             ],
// //             "messages": [
// //               {
// //                 "from": "5511888888888", Cliente
// //                 "id": "wamid.HBgMNTUxMTg4ODg4ODg4FQIAERgSOTkzODIxNkJDNzZBRjRGNkZC",
// //                 "timestamp": "1730642174",
// //                 "text": {
// //                   "body": "Olá, tudo bem?" message cliente
// //                 },
// //                 "type": "text"
// //               }
// //             ]
// //           },
// //           "field": "messages"
// //         }
// //       ]
// //     }
// //   ]
// // }

//     const Idcompany = await prisma.company.findUnique({
//         where: {
//             numero: empresaNumber
//         }
//     })

//     await prisma.cliente.create({
//         data: {
//             contato: clientNumber,
//             company: {
//                 connect: { id: Idcompany?.id}
//             }
            
//         }
//     })

    // System(clientNumber, messgaeClient)
}