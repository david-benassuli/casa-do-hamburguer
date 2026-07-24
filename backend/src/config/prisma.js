import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.ts'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({connectionString})
export const prisma = new PrismaClient({adapter})

export async function connection() {
    await prisma.$connect()
    console.log('Prisma conectado com o banco de dados')
}