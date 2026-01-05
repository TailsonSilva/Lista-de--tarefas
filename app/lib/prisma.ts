import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Na versão 7, passamos a URL aqui:
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // @ts-ignore
    datasourceUrl: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db