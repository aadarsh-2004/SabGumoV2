/**
 * Create Default Admin Script
 * 
 * This script creates a default admin user in the Supabase database.
 * Run this once after setting up the tables in Supabase.
 * 
 * Usage: node create-default-admin.js
 */

require('dotenv').config();
const supabase = require('./supabase');
const bcrypt = require('bcrypt');

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'password'; // Change this to a secure password
const SALT_ROUNDS = 10;

async function createDefaultAdmin() {
  console.log('Creating default admin user...');
  
  try {
    // Check if admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', DEFAULT_USERNAME);
    
    if (checkError) throw new Error(`Error checking for existing admin: ${checkError.message}`);
    
    if (existingAdmins && existingAdmins.length > 0) {
      console.log(`Admin user '${DEFAULT_USERNAME}' already exists with ID: ${existingAdmins[0].id}`);
      return;
    }
    
    // Hash the password
    const password_hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    
    // Insert the admin user
    const { data, error } = await supabase
      .from('admins')
      .insert([
        { username: DEFAULT_USERNAME, password_hash }
      ])
      .select();
    
    if (error) throw new Error(`Error creating admin: ${error.message}`);
    
    console.log(`✅ Default admin user '${DEFAULT_USERNAME}' created successfully with ID: ${data[0].id}`);
    console.log(`   You can log in with username: '${DEFAULT_USERNAME}' and password: '${DEFAULT_PASSWORD}'`);
    console.log('   Remember to change the default password for security!');
    
  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
  }
}

createDefaultAdmin(); 