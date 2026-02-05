const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ WARNING: Missing Supabase credentials. Backend will fail to interact with database.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 