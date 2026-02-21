import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '+1234567890',
      country: 'Nigeria',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      country: 'Kenya',
    },
  })

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Professional Logo Design',
        category: 'graphic-design',
        description: 'Custom logo design for your brand',
        longDescription: 'Get a professionally designed logo that represents your brand identity. Includes 3 revisions and multiple formats.',
        price: 100000,
        rating: 4.8,
        reviewCount: 24,
        deliveryDays: 5,
        provider: 'Ahmed Hassan',
        providerRating: 4.9,
        included: JSON.stringify(['Unlimited revisions', 'Multiple file formats', 'Vector and raster', '100% original design']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Business Flyer Design',
        category: 'graphic-design',
        description: 'Eye-catching business flyer',
        longDescription: 'Professional business flyer design that grabs attention and converts.',
        price: 50000,
        rating: 4.6,
        reviewCount: 18,
        deliveryDays: 3,
        provider: 'Zainab Ibrahim',
        providerRating: 4.7,
        included: JSON.stringify(['Front and back design', '2 revisions', 'Print-ready files', 'Source file included']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Professional Resume Template',
        category: 'templates',
        description: 'Ready-to-use resume template',
        longDescription: 'Modern, ATS-friendly resume template that helps you stand out to employers.',
        price: 15000,
        rating: 4.7,
        reviewCount: 156,
        deliveryDays: 1,
        provider: 'James Wilson',
        providerRating: 4.8,
        included: JSON.stringify(['Word and PDF format', 'Editable design', 'Multiple color versions', 'Cover letter included']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Excel Financial Dashboard Template',
        category: 'templates',
        description: 'Business analytics dashboard',
        longDescription: 'Pre-built Excel dashboard for tracking business metrics and KPIs.',
        price: 30000,
        rating: 4.5,
        reviewCount: 89,
        deliveryDays: 1,
        provider: 'Sarah Chen',
        providerRating: 4.6,
        included: JSON.stringify(['Fully functional formulas', 'Charts and graphs', 'Data sample included', 'Custom support']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Professional Content Writing',
        category: 'writing',
        description: 'High-quality article writing',
        longDescription: 'SEO-optimized article writing for blogs, websites, and marketing materials.',
        price: 65000,
        rating: 4.9,
        reviewCount: 142,
        deliveryDays: 5,
        provider: 'Emma Thompson',
        providerRating: 4.9,
        included: JSON.stringify(['Original research', 'SEO optimization', '1000-2000 words', '2 revisions', 'Free plagiarism check']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Product Description Writing',
        category: 'writing',
        description: 'Compelling product descriptions',
        longDescription: 'Conversion-focused product descriptions that sell.',
        price: 35000,
        rating: 4.8,
        reviewCount: 95,
        deliveryDays: 2,
        provider: 'David Martinez',
        providerRating: 4.8,
        included: JSON.stringify(['Up to 5 products', 'SEO keywords', 'Persuasive copy', '1 revision round']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Responsive Website Development',
        category: 'web-dev',
        description: 'Modern website development',
        longDescription: 'Custom-built responsive website using latest technologies and best practices.',
        price: 325000,
        rating: 4.7,
        reviewCount: 34,
        deliveryDays: 14,
        provider: 'Alex Johnson',
        providerRating: 4.8,
        included: JSON.stringify(['Responsive design', 'Mobile optimized', 'SEO friendly', 'Speed optimized', 'SSL included', 'CMS setup']),
      },
    }),
    prisma.service.create({
      data: {
        name: 'Landing Page Design & Development',
        category: 'web-dev',
        description: 'High-converting landing pages',
        longDescription: 'Professionally designed and developed landing pages optimized for conversions.',
        price: 165000,
        rating: 4.6,
        reviewCount: 52,
        deliveryDays: 7,
        provider: 'Lisa Park',
        providerRating: 4.7,
        included: JSON.stringify(['Mobile responsive', 'Contact form setup', 'Analytics integration', 'Email integration', 'Free SSL']),
      },
    }),
  ])

  console.log(`✅ Seeded database with ${services.length} services and 2 users`)
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
