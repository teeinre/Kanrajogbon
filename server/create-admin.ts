import { db } from './db';
import { storage } from './storage';
import bcrypt from 'bcrypt';
import { insertUserSchema } from '@shared/schema';

async function createAdminAccount() {
  try {
    console.log('Creating admin account...');
    
    const adminEmail = 'admin@findermeister.com';
    const adminPassword = 'Admin123!@#';
    
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('❌ Admin account already exists with email:', adminEmail);
      console.log('Admin details:');
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      console.log('- Verified:', existingAdmin.isVerified);
      console.log('- Created:', existingAdmin.createdAt);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user data
    const adminData = insertUserSchema.parse({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true
    });
    
    // Create admin user
    const adminUser = await storage.createUser(adminData);
    
    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('');
    console.log('📋 Admin Details:');
    console.log('- User ID:', adminUser.id);
    console.log('- Name:', `${adminUser.firstName} ${adminUser.lastName}`);
    console.log('- Role:', adminUser.role);
    console.log('- Verified:', adminUser.isVerified);
    console.log('- Created:', adminUser.createdAt);
    console.log('');
    console.log('🌐 Access the admin panel at: http://localhost:5000/admin');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
createAdminAccount();