const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function debugTokens() {
  try {
    const usersWithTokens = await prisma.user.findMany({
      where: {
        resetToken: { not: null }
      },
      select: {
        email: true,
        resetToken: true,
        resetTokenExpires: true
      }
    })

    console.log('--- Database Token Debug ---')
    if (usersWithTokens.length === 0) {
      console.log('No users found with a reset token.')
    } else {
      usersWithTokens.forEach(u => {
        console.log(`User: ${u.email}`)
        console.log(`Token: ${u.resetToken}`)
        console.log(`Expires: ${u.resetTokenExpires}`)
        console.log(`Expired? ${u.resetTokenExpires < new Date()}`)
        console.log('---------------------------')
      })
    }
  } catch (e) {
    console.error('Error debugging tokens:', e.message)
    console.log('\nTip: If you see "Unknown field resetToken", your Prisma Client is not up to date.')
  } finally {
    await prisma.$disconnect()
  }
}

debugTokens()
