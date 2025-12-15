import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../node_modules/.prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
// sempre que houver mudanças no schema.prisma, usar o { npx prisma generate } para atualizar o prisma client
// sempre que atualizar o schema.prisma, usar o { prisma migrate dev } ou { prisma db push } para atualizar o banco de dados