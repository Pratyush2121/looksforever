import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from '../api/lib/models.js';
import { hashPassword } from '../api/lib/auth.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n❌ Error: MONGODB_URI is not defined in your .env file.');
  console.error('Please configure MONGODB_URI in .env and run this command again.\n');
  process.exit(1);
}

const args = process.argv.slice(2);
const username = args[0];
const email = args[1];
const password = args[2];

if (!username || !email || !password) {
  console.log('\nUsage:');
  console.log('  node scripts/create-admin.js <username> <email> <password>\n');
  console.log('Example:');
  console.log('  node scripts/create-admin.js admin care@looksforever.org StrongPass123!\n');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Error: Password must be at least 6 characters.');
  process.exit(1);
}

async function createAdmin() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  const cleanUsername = username.toLowerCase().trim();
  const cleanEmail = email.toLowerCase().trim();

  const existing = await Admin.findOne({
    $or: [{ username: cleanUsername }, { email: cleanEmail }],
  });

  if (existing) {
    console.error(`\n❌ Error: Admin with username "${cleanUsername}" or email "${cleanEmail}" already exists.\n`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const newAdmin = await Admin.create({
    username: cleanUsername,
    email: cleanEmail,
    passwordHash,
    role: 'SUPER_ADMIN',
  });

  console.log('\n🎉 Admin account successfully created!');
  console.log(`   ID:       ${newAdmin._id}`);
  console.log(`   Username: ${newAdmin.username}`);
  console.log(`   Email:    ${newAdmin.email}`);
  console.log(`   Role:     ${newAdmin.role}\n`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('❌ Error creating admin:', err.message);
  process.exit(1);
});

