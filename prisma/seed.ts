import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  await prisma.feedback.deleteMany()

  await prisma.user.create({
    data: {
      firstName: 'Jonathan',
      lastName: 'Jayet',
      email: 'jonathan@jayet.io',
      password: '123123'
    },
  })
  await prisma.user.create({
    data: { firstName: 'JP', lastName: 'Bois', email: 'jean-pascal@bois.io', password: '123123' },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
