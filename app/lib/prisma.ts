import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // @ts-ignore - isso remove o erro vermelho se o TS local estiver teimoso
    datasourceUrl: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db