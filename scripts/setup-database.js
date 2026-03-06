import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up Execly Database...');

try {
  // Check if .env.local exists
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('Please create .env.local with your DATABASE_URL');
    process.exit(1);
  }

  // Read and validate DATABASE_URL
  const envContent = fs.readFileSync(envPath, 'utf8');
  const databaseUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];

  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found');

  // Test database connection
  console.log('🔍 Testing database connection...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log('Please check your DATABASE_URL in .env.local');
    process.exit(1);
  }

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.log('❌ Failed to generate Prisma client');
    process.exit(1);
  }

  console.log('🎉 Database setup complete!');
  console.log('You can now run: npm run dev');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}

