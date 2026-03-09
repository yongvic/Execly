const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function count() {
  try {
    const count = await prisma.service.count()
    console.log(`Nombre de services en base de données : ${count}`)
  } catch (e) {
    console.error('Erreur Prisma :', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

count()
