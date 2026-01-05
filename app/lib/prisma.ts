import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Na v7, se você já tem a DATABASE_URL no .env ou na Vercel, 
// o Prisma Client já a lê automaticamente do schema.
export const db =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db