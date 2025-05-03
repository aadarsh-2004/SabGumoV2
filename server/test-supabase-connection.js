/**
 * Test script for Supabase connection
 * 
 * This script tests the connection to Supabase and performs basic CRUD operations
 * to verify that everything is working correctly.
 * 
 * Usage: node test-supabase-connection.js
 */

require('dotenv').config();
const supabase = require('./supabase');

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // 1. First, check if we can connect to Supabase
    console.log(`Connecting to Supabase at: ${process.env.SUPABASE_URL}`);
    
    // Test connection by getting table information (a simpler check)
    const { error: connectionError } = await supabase
      .from('trips')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    
    console.log('✅ Connected to Supabase successfully');

    // 2. Test retrieving data from the tables
    console.log('\nTesting table access...');
    
    // Test trips table
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id, location_name, title')
      .limit(5);
    
    if (tripsError) throw new Error(`Trips table error: ${tripsError.message}`);
    console.log(`✅ Trips table accessible. Found ${trips.length} trips.`);
    
    // Test inquiries table
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('inquiries')
      .select('id, name, email')
      .limit(5);
    
    if (inquiriesError) throw new Error(`Inquiries table error: ${inquiriesError.message}`);
    console.log(`✅ Inquiries table accessible. Found ${inquiries.length} inquiries.`);
    
    // Test admins table
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('id, username')
      .limit(5);
    
    if (adminsError) throw new Error(`Admins table error: ${adminsError.message}`);
    console.log(`✅ Admins table accessible. Found ${admins.length} admins.`);
    
    // 3. Test CRUD operations with a temporary record
    console.log('\nTesting CRUD operations with a test inquiry...');
    
    // Create - Insert test record
    const testInquiry = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123-456-7890',
      destination: 'Test Destination',
      message: 'This is a test inquiry. Please delete me.',
      received_at: new Date().toISOString(),
      is_completed: false
    };
    
    const { data: insertedInquiry, error: insertError } = await supabase
      .from('inquiries')
      .insert([testInquiry])
      .select();
    
    if (insertError) throw new Error(`Failed to insert test record: ${insertError.message}`);
    const testId = insertedInquiry[0].id;
    console.log(`✅ Created test record with ID: ${testId}`);
    
    // Read - Get the inserted record
    const { data: readInquiry, error: readError } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (readError) throw new Error(`Failed to read test record: ${readError.message}`);
    console.log(`✅ Read test record: ${readInquiry.name} / ${readInquiry.email}`);
    
    // Update - Update the test record
    const { data: updatedInquiry, error: updateError } = await supabase
      .from('inquiries')
      .update({ is_completed: true })
      .eq('id', testId)
      .select();
    
    if (updateError) throw new Error(`Failed to update test record: ${updateError.message}`);
    console.log(`✅ Updated test record is_completed to: ${updatedInquiry[0].is_completed}`);
    
    // Delete - Clean up the test record
    const { error: deleteError } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', testId);
    
    if (deleteError) throw new Error(`Failed to delete test record: ${deleteError.message}`);
    console.log(`✅ Deleted test record with ID: ${testId}`);
    
    console.log('\n🎉 All tests passed successfully! Your Supabase setup is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nPlease check your Supabase credentials and make sure your tables are set up correctly.');
  }
}

testSupabaseConnection(); 