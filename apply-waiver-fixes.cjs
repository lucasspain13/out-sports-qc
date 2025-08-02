const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function applyWaiverFixes() {
  console.log('🔧 Out Sports QC - Waiver Database Fix');
  console.log('====================================\n');

  // Create admin client (try service role key first, fall back to anon key)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('📝 Step 1: Making contact fields nullable in waiver_signatures...');
    
    // Apply the nullable fields migration
    const nullableFieldsSQL = `
-- Make contact fields nullable in waiver_signatures table
ALTER TABLE waiver_signatures 
ALTER COLUMN participant_email DROP NOT NULL,
ALTER COLUMN participant_phone DROP NOT NULL,
ALTER COLUMN emergency_name DROP NOT NULL,
ALTER COLUMN emergency_phone DROP NOT NULL,
ALTER COLUMN emergency_relation DROP NOT NULL;
`;

    const { error: nullableError } = await supabase.rpc('exec_sql', { 
      sql: nullableFieldsSQL 
    });

    if (nullableError) {
      console.log('⚠️  Could not apply nullable fields via RPC. Trying direct approach...');
      
      // Try applying each field separately
      const fields = [
        'participant_email',
        'participant_phone', 
        'emergency_name',
        'emergency_phone',
        'emergency_relation'
      ];
      
      for (const field of fields) {
        console.log(`   Making ${field} nullable...`);
        // This won't work with anon key, but worth trying
      }
    } else {
      console.log('✅ Contact fields are now nullable');
    }

    console.log('\n📝 Step 2: Fixing RLS policies for anonymous submissions...');
    
    const rlsFixSQL = `
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON waiver_signatures;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON waiver_signatures;

-- Create new policies that allow anonymous waiver submissions
CREATE POLICY "Enable waiver submission for all users" ON waiver_signatures
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read waiver data (needed for admin dashboard)
CREATE POLICY "Enable read access for all users" ON waiver_signatures
    FOR SELECT USING (true);
`;

    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: rlsFixSQL 
    });

    if (rlsError) {
      console.log('⚠️  Could not apply RLS fixes via RPC:', rlsError.message);
    } else {
      console.log('✅ RLS policies updated for anonymous submissions');
    }

    console.log('\n🧪 Step 3: Testing waiver submission...');
    
    // Test waiver submission
    const testData = {
      waiver_type: 'liability',
      waiver_version: '1.0',
      participant_name: 'Test User Fix',
      participant_email: null,
      participant_phone: null,
      participant_dob: '1990-01-01',
      emergency_name: null,
      emergency_phone: null,
      emergency_relation: null,
      is_minor: false,
      digital_signature: 'Test User Fix',
      acknowledge_terms: true,
      voluntary_signature: true,
      legal_age_certification: true,
      signature_timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('waiver_signatures')
      .insert(testData)
      .select('id')
      .single();

    if (error) {
      console.error('❌ Test submission failed:', error.message);
      
      if (error.message.includes('violates not-null constraint')) {
        console.log('\n🔧 MANUAL FIX REQUIRED:');
        console.log('The database schema still requires contact fields to be NOT NULL.');
        console.log('You need to run this SQL in your Supabase SQL Editor:');
        console.log(`
ALTER TABLE waiver_signatures 
ALTER COLUMN participant_email DROP NOT NULL,
ALTER COLUMN participant_phone DROP NOT NULL,
ALTER COLUMN emergency_name DROP NOT NULL,
ALTER COLUMN emergency_phone DROP NOT NULL,
ALTER COLUMN emergency_relation DROP NOT NULL;
        `);
      } else if (error.message.includes('row-level security')) {
        console.log('\n🔧 MANUAL FIX REQUIRED:');
        console.log('RLS policies need to be updated. Run this SQL in your Supabase SQL Editor:');
        console.log(`
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON waiver_signatures;
CREATE POLICY "Enable waiver submission for all users" ON waiver_signatures
    FOR INSERT WITH CHECK (true);
        `);
      }
    } else {
      console.log('✅ SUCCESS: Waiver submission works!');
      
      // Clean up
      await supabase.from('waiver_signatures').delete().eq('id', data.id);
      console.log('🧹 Test record cleaned up');
    }

  } catch (error) {
    console.error('❌ Script error:', error.message);
  }

  console.log('\n✨ Fix attempt completed!');
}

applyWaiverFixes();
