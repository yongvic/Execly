const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: hashedPassword,
      phone: '+1 234 567 8900',
      country: 'Nigeria',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      phone: '+1 987 654 3210',
      country: 'Kenya',
    },
  });

  console.log('✓ Users created');

  // Create sample services
  const services = [
    {
      name: 'Professional Logo Design',
      category: 'graphic-design',
      description: 'Custom logo design with unlimited revisions',
      longDescription:
        'Get a professionally designed logo that represents your brand. Includes 5 unique concepts, unlimited revisions until satisfaction, and source files in all formats.',
      price: 150,
      image:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      rating: 4.8,
      reviewCount: 124,
      deliveryDays: 5,
      provider: 'Creative Studio',
      providerImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      providerRating: 4.9,
      included: JSON.stringify([
        '5 unique logo concepts',
        'Unlimited revisions',
        'All file formats (PNG, SVG, AI)',
        'Brand guidelines document',
        'Commercial license',
      ]),
    },
    {
      name: 'Website Templates Bundle',
      category: 'templates',
      description: 'Modern responsive website templates',
      longDescription:
        'Get access to 50+ modern, responsive website templates built with HTML, CSS, and JavaScript. All templates are fully customizable and ready to use.',
      price: 49,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
      rating: 4.6,
      reviewCount: 89,
      deliveryDays: 1,
      provider: 'Template Hub',
      providerImage:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      providerRating: 4.8,
      included: JSON.stringify([
        '50+ responsive templates',
        'Source code access',
        'Free updates',
        'Documentation',
        'Personal support',
      ]),
    },
    {
      name: 'Content Writing Service',
      category: 'writing',
      description: 'SEO-optimized blog posts and articles',
      longDescription:
        'Professional writers will create engaging, SEO-optimized content for your blog or website. Includes research, writing, editing, and optimization.',
      price: 120,
      image:
        'https://images.unsplash.com/photo-1455849318169-8381a305dda7?w=500&h=500&fit=crop',
      rating: 4.9,
      reviewCount: 156,
      deliveryDays: 7,
      provider: 'Writing Pro',
      providerImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      providerRating: 4.9,
      included: JSON.stringify([
        'Custom content creation',
        'SEO optimization',
        'Plagiarism check',
        '2 rounds of revisions',
        'Keyword research',
      ]),
    },
    {
      name: 'WordPress Website Setup',
      category: 'web-dev',
      description: 'Complete WordPress site setup with plugins',
      longDescription:
        'Get a fully functional WordPress website with your choice of premium theme, essential plugins, and basic customization.',
      price: 250,
      image:
        'https://images.unsplash.com/photo-1460925895917-adf4e565db11?w=500&h=500&fit=crop',
      rating: 4.7,
      reviewCount: 92,
      deliveryDays: 10,
      provider: 'Web Masters',
      providerImage:
        'https://images.unsplash.com/photo-1507537557991-b3cf7e4440b9?w=100&h=100&fit=crop',
      providerRating: 4.9,
      included: JSON.stringify([
        'Domain setup assistance',
        'WordPress installation',
        'Premium theme',
        '10 essential plugins',
        'Basic SEO setup',
        '30 days support',
      ]),
    },
    {
      name: 'Business Card Design',
      category: 'graphic-design',
      description: 'Unique business card design',
      longDescription:
        'Professional business card design with multiple concepts and print-ready files.',
      price: 50,
      image:
        'https://images.unsplash.com/photo-1611605698335-8be5fcf97f4e?w=500&h=500&fit=crop',
      rating: 4.5,
      reviewCount: 67,
      deliveryDays: 3,
      provider: 'Design Pro',
      providerImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      providerRating: 4.8,
      included: JSON.stringify([
        '3 design concepts',
        'Print-ready files',
        'Unlimited revisions',
        'Source file included',
      ]),
    },
    {
      name: 'Email Template Collection',
      category: 'templates',
      description: '30 responsive email templates',
      longDescription:
        'Professional email templates for marketing campaigns, newsletters, and transactional emails.',
      price: 35,
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop',
      rating: 4.4,
      reviewCount: 54,
      deliveryDays: 1,
      provider: 'Email Design Studio',
      providerImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      providerRating: 4.7,
      included: JSON.stringify([
        '30 responsive templates',
        'HTML and Litmus tested',
        'Customizable sections',
        'Documentation',
      ]),
    },
    {
      name: 'Resume Writing Service',
      category: 'writing',
      description: 'Professional resume and CV writing',
      longDescription:
        'Get a professionally written resume optimized for ATS systems. Includes cover letter and LinkedIn profile optimization.',
      price: 80,
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop',
      rating: 4.8,
      reviewCount: 203,
      deliveryDays: 5,
      provider: 'Career Experts',
      providerImage:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      providerRating: 4.9,
      included: JSON.stringify([
        'Professional resume',
        'Cover letter',
        'LinkedIn optimization',
        '3 revisions',
        'ATS optimization',
      ]),
    },
    {
      name: 'Mobile App Development',
      category: 'web-dev',
      description: 'Custom mobile app development',
      longDescription:
        'Build a custom mobile application for iOS and Android with modern technologies and best practices.',
      price: 1500,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
      rating: 4.9,
      reviewCount: 45,
      deliveryDays: 30,
      provider: 'App Development Co',
      providerImage:
        'https://images.unsplash.com/photo-1507537557991-b3cf7e4440b9?w=100&h=100&fit=crop',
      providerRating: 5.0,
      included: JSON.stringify([
        'iOS and Android development',
        'UI/UX design',
        'API integration',
        'Testing and QA',
        '3 months support',
      ]),
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name }
    });
    if (!existing) {
      await prisma.service.create({
        data: service,
      });
    }
  }

  console.log('✓ Services created');

  // Add a sample review
  const order = await prisma.order.create({
    data: {
      userId: user1.id,
      serviceId: (await prisma.service.findFirst({ where: { category: 'graphic-design' } })).id,
      quantity: 1,
      totalPrice: 150,
      status: 'completed',
    },
  });

  await prisma.review.create({
    data: {
      orderId: order.id,
      userId: user1.id,
      serviceId: order.serviceId,
      rating: 5,
      comment: 'Excellent service! The designer understood my vision perfectly.',
    },
  });

  console.log('✓ Sample review created');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
