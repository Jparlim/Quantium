import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

async function Main() {
    
}

Main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

export default prisma
// sempre que houver mudanças no schema.prisma, usar o { npx prisma generate } para atualizar o prisma client
// sempre que atualizar o schema.prisma, usar o { prisma migrate dev } ou { prisma db push } para atualizar o banco de dados