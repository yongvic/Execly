import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const dbPath = resolve('prisma/dev.db');
const hasDb = existsSync(dbPath);

console.log('🚀 Execly Database Auto-Setup\n');

const runCommand = (cmd, args, name) => {
  return new Promise((resolve, reject) => {
    console.log(`⏳ ${name}...`);
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${name} complete\n`);
        resolve();
      } else {
        reject(new Error(`${name} failed with code ${code}`));
      }
    });
  });
};

async function setup() {
  try {
    // Step 1: Generate Prisma Client
    await runCommand('npx', ['prisma', 'generate'], 'Generating Prisma Client');

    // Step 2: Create or update database schema
    if (!hasDb) {
      await runCommand('npx', ['prisma', 'db', 'push', '--skip-generate'], 'Creating database schema');
    } else {
      console.log('✓ Database already exists\n');
    }

    // Step 3: Seed database
    await runCommand('node', ['prisma/seed.js'], 'Seeding database');

    console.log('✅ Database setup complete!\n');
    console.log('📚 You can now start the app with: npm run dev\n');
    console.log('🔑 Test Credentials:');
    console.log('   Email: user@example.com');
    console.log('   Password: password123\n');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n📖 Check DATABASE_SETUP.md for manual setup instructions');
    process.exit(1);
  }
}

setup();

