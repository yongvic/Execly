#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Initializing Execly Database...\n');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma Client generated\n');

  // Run migrations
  console.log('🗄️  Creating database schema...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✓ Database schema created\n');

  // Seed database
  console.log('🌱 Seeding database with sample data...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✓ Database seeded\n');

  console.log('✅ Database initialization complete!\n');
  console.log('📚 Database ready with sample services and users.');
  console.log('🚀 You can now start the development server with: npm run dev\n');
} catch (error) {
  console.error('❌ Error during initialization:', error.message);
  process.exit(1);
}

