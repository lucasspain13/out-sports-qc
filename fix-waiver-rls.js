const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function fixWaiverRLS() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('Testing waiver submission with current RLS policies...');
    
    // Try to insert a test waiver record to see what happens
    const testData = {
      waiver_type: 'liability',
      waiver_version: '1.0',
      participant_name: 'Test User',
      participant_email: null,
      participant_phone: null,
      participant_dob: '1990-01-01',
      emergency_name: null,
      emergency_phone: null,
      emergency_relation: null,
      is_minor: false,
      guardian_name: null,
      guardian_relation: null,
      digital_signature: 'Test User',
      acknowledge_terms: true,
      voluntary_signature: true,
      legal_age_certification: true,
      ip_address: null,
      user_agent: 'Test Script',
      signature_timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('waiver_signatures')
      .insert(testData)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Waiver submission failed with error:', error.message);
      console.log('This confirms the RLS policy is blocking anonymous submissions.');
      
      if (error.message.includes('new row violates row-level security policy')) {
        console.log('\n🔧 To fix this issue, you need to update the RLS policies in your Supabase dashboard:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to Table Editor > waiver_signatures');
        console.log('3. Click on "RLS disabled" or the RLS settings');
        console.log('4. Update the INSERT policy to allow anonymous users:');
        console.log('   Policy name: "Enable waiver submission for all users"');
        console.log('   Policy target: INSERT');
        console.log('   Policy definition: WITH CHECK (true)');
        console.log('\nAlternatively, you can run this SQL in the SQL Editor:');
        console.log(`
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON waiver_signatures;
CREATE POLICY "Enable waiver submission for all users" ON waiver_signatures
    FOR INSERT WITH CHECK (true);
        `);
      }
    } else {
      console.log('✅ Test waiver submission successful!');
      console.log('RLS policies are working correctly for anonymous submissions.');
      
      // Clean up test record
      await supabase
        .from('waiver_signatures')
        .delete()
        .eq('id', data.id);
      console.log('Test record cleaned up.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the fix
fixWaiverRLS();
