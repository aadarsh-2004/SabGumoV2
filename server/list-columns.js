require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listColumns() {
  const { data, error } = await supabase.rpc('get_columns', { table_name: 'trips' });
  if (error) {
    // If RPC doesn't exist, try a select from information_schema via a trick or just a simple select * limit 1
    console.log('RPC failed, trying select * limit 1');
    const { data: selectData, error: selectError } = await supabase.from('trips').select('*').limit(1);
    if (selectError) {
      console.error('Select failed:', selectError);
    } else {
      console.log('Columns in trips table:', selectData.length > 0 ? Object.keys(selectData[0]) : 'No data in table to infer columns');
    }
  } else {
    console.log('Columns:', data);
  }
}

listColumns();
