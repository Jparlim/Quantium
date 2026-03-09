import { prisma } from "./index";

export async function DelPending() {
    await prisma.company_Pending.deleteMany({
        where: {
            token_expires: {
                lt: new Date()
            }
        }
    })

    console.log("dados foram apagados!!")
}