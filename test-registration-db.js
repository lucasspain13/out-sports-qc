// Test script to check registration details table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvnehtqovvfdudzvagss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bmVodHFvdnZmZHVkenZhZ3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mzg5MTMsImV4cCI6MjA2ODExNDkxM30.heLyYI9b5rS3uwNSdZs5wMdv_wZfbiG-OaOXbxYAwA0';

console.log('🔍 Testing registration details database...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistrationDB() {
  try {
    // Test if table exists and has data
    console.log('1. Testing table access...');
    const { data, error } = await supabase
      .from('registration_details')
      .select('*');
    
    if (error) {
      console.error('❌ Error accessing registration_details table:', error.message);
      console.log('Table may not exist yet. This is normal if migrations haven\'t been run.');
      return;
    }
    
    console.log('✅ Table access successful');
    console.log('Current records:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📊 Table data:');
      data.forEach(record => {
        console.log(`  - ${record.sport_type}: ${record.sport} ${record.season}`);
      });
    } else {
      console.log('📊 Table is empty');
    }
    
    // Test specific kickball query that RegistrationPage uses
    console.log('\n2. Testing kickball query...');
    const { data: kickballData, error: kickballError } = await supabase
      .from('registration_details')
      .select('*')
      .eq('sport_type', 'kickball')
      .single();
    
    if (kickballError) {
      if (kickballError.code === 'PGRST116') {
        console.log('⚠️  No kickball registration data found (this is expected if not set up yet)');
      } else {
        console.error('❌ Error querying kickball data:', kickballError.message);
      }
    } else {
      console.log('✅ Kickball data found:', kickballData);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testRegistrationDB();
