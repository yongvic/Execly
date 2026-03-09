const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const serviceCatalog = [
  {
    slug: 'cv-pro',
    name: 'Creation de CV professionnel',
    category: 'cv',
    description: 'CV premium adapte a ton objectif.',
    longDescription: 'Tu choisis un template, nous livrons un CV premium optimise ATS.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
    deliveryDays: 4,
    provider: 'Execly Studio',
    included: ['Audit profil', '2 revisions', 'PDF + DOCX'],
    template: {
      slug: 'cv-minimal-ats',
      name: 'Minimal CV ATS',
      description: 'Template CV moderne et lisible pour les recruteurs.',
      previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
      tags: ['cv', 'ats', 'minimal'],
    },
  },
  {
    slug: 'portfolio-pro',
    name: 'Creation de portfolio',
    category: 'portfolio',
    description: 'Portfolio digital moderne pour etudiants et freelances.',
    longDescription: 'Une structure claire, un design impactant et une personnalisation complete.',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop',
    deliveryDays: 7,
    provider: 'Execly Studio',
    included: ['Structure UX', 'Direction visuelle', 'Retouches'],
    template: {
      slug: 'portfolio-creative-grid',
      name: 'Portfolio Creative Grid',
      description: 'Template portfolio visuel pour designers et devs.',
      previewImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop',
      tags: ['portfolio', 'creative'],
    },
  },
  {
    slug: 'graphic-design',
    name: 'Design graphique (flyers/visuels)',
    category: 'graphic-design',
    description: 'Visuels branding modernes et conversion-focused.',
    longDescription: 'Flyers, visuels social media et mini-kit branding premium.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop',
    deliveryDays: 3,
    provider: 'Execly Studio',
    included: ['Direction creative', '3 variantes', 'Fichiers HD'],
    template: {
      slug: 'flyer-bold-launch',
      name: 'Flyer Bold Launch',
      description: 'Template graphique fort pour promotions et campagnes.',
      previewImage: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=800&fit=crop',
      tags: ['design', 'flyer'],
    },
  },
  {
    slug: 'web-vitrine',
    name: 'Creation de site web vitrine',
    category: 'web-dev',
    description: 'Site vitrine moderne, responsive et rapide.',
    longDescription: 'Une presence web premium orientee conversion pour ton profil ou business.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
    deliveryDays: 10,
    provider: 'Execly Studio',
    included: ['UI premium', 'Developpement', 'SEO technique de base'],
    template: {
      slug: 'saas-velocity',
      name: 'SaaS Velocity',
      description: 'Template landing moderne style startup premium.',
      previewImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
      tags: ['web', 'saas'],
    },
  },
  {
    slug: 'slides-pro',
    name: 'Presentation PowerPoint',
    category: 'presentation',
    description: 'Slides premium pour soutenance, pitch ou projet.',
    longDescription: 'Storyline claire + design visuel pour presentations impactantes.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    deliveryDays: 4,
    provider: 'Execly Studio',
    included: ['Structure narrative', 'Animations subtiles', 'PPTX + PDF'],
    template: {
      slug: 'pitch-modern',
      name: 'Pitch Deck Modern',
      description: 'Template de presentation clair, business et moderne.',
      previewImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
      tags: ['slides', 'pitch'],
    },
  },
  {
    slug: 'writing-academic',
    name: 'Correction et redaction academique',
    category: 'writing',
    description: 'Correction, reformulation et redaction academique.',
    longDescription: 'Accompagnement memoires, rapports et devoirs avec qualite premium.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=800&fit=crop',
    deliveryDays: 5,
    provider: 'Execly Studio',
    included: ['Correction avancee', 'Mise en forme', 'Feedback detaille'],
    template: {
      slug: 'academic-report-pro',
      name: 'Academic Report Pro',
      description: 'Template de rendu academique propre et structure.',
      previewImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=800&fit=crop',
      tags: ['writing', 'academic'],
    },
  },
]

async function main() {
  console.log('Reset seed Execly v2...')

  await prisma.message.deleteMany()
  await prisma.chatThread.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.notificationPreference.deleteMany()
  await prisma.deliverable.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.template.deleteMany()
  await prisma.serviceDeliveryOption.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Young User',
      password: hashedPassword,
      phone: '+22890000000',
      country: 'TG',
      role: 'USER',
      notificationPreferences: {
        create: { inAppEnabled: true, emailEnabled: true, whatsappEnabled: true },
      },
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Execly Admin',
      password: hashedPassword,
      phone: '+22891000000',
      country: 'TG',
      role: 'ADMIN',
      notificationPreferences: {
        create: { inAppEnabled: true, emailEnabled: true, whatsappEnabled: true },
      },
    },
  })

  const createdServices = []
  for (const s of serviceCatalog) {
    const service = await prisma.service.create({
      data: {
        slug: s.slug,
        name: s.name,
        category: s.category,
        description: s.description,
        longDescription: s.longDescription,
        price: s.price,
        image: s.image,
        deliveryDays: s.deliveryDays,
        provider: s.provider,
        included: JSON.stringify(s.included),
      },
    })

    await prisma.template.create({
      data: {
        serviceId: service.id,
        slug: s.template.slug,
        name: s.template.name,
        category: s.category,
        description: s.template.description,
        previewImage: s.template.previewImage,
        tags: JSON.stringify(s.template.tags),
      },
    })

    await prisma.serviceDeliveryOption.createMany({
      data: [
        {
          serviceId: service.id,
          label: 'Standard',
          turnaroundDays: s.deliveryDays,
          priceMultiplier: 1,
          isDefault: true,
        },
        {
          serviceId: service.id,
          label: 'Express',
          turnaroundDays: Math.max(1, Math.floor(s.deliveryDays * 0.6)),
          priceMultiplier: 1.35,
          isDefault: false,
        },
      ],
    })

    createdServices.push(service)
  }

  const cvService = createdServices[0]
  const cvTemplate = await prisma.template.findFirstOrThrow({
    where: { serviceId: cvService.id },
  })

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      amount: cvService.price,
      method: 'FLOOZ',
      phone: user.phone,
      status: 'CONFIRMED',
      providerRef: `seed_${Date.now()}`,
      otpCode: '123456',
      otpConfirmedAt: new Date(),
    },
  })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      serviceId: cvService.id,
      templateId: cvTemplate.id,
      quantity: 1,
      totalPrice: cvService.price,
      status: 'COMPLETED',
      paymentId: payment.id,
      customizationBrief: 'CV pour candidature stage produit.',
      deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      deliverableUrl: 'https://blob.vercel-storage.com/execly/sample-cv.pdf',
    },
  })

  await prisma.deliverable.create({
    data: {
      orderId: order.id,
      fileName: 'sample-cv.pdf',
      blobUrl: 'https://blob.vercel-storage.com/execly/sample-cv.pdf',
      mimeType: 'application/pdf',
      uploadedById: admin.id,
    },
  })

  const thread = await prisma.chatThread.create({
    data: {
      orderId: order.id,
      customerId: user.id,
    },
  })

  await prisma.message.createMany({
    data: [
      {
        threadId: thread.id,
        senderId: admin.id,
        body: 'Bonjour, nous avons bien recu ton brief. Livraison prevue sous 4 jours.',
      },
      {
        threadId: thread.id,
        senderId: user.id,
        body: 'Parfait, merci.',
      },
    ],
  })

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Paiement confirme',
        body: 'Ton paiement a ete confirme et la commande est en cours.',
        channel: 'IN_APP',
      },
      {
        userId: user.id,
        title: 'Paiement confirme (Email)',
        body: 'Un email de confirmation a ete envoye.',
        channel: 'EMAIL',
      },
      {
        userId: user.id,
        title: 'Paiement confirme (WhatsApp)',
        body: 'Un message WhatsApp de confirmation a ete envoye.',
        channel: 'WHATSAPP',
      },
    ],
  })

  console.log('Seed Execly v2 termine.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
