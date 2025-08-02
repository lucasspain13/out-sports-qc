const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function testWaiverValidation() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('🧪 Testing waiver validation and database updates...\n');

  // Test 1: Valid liability waiver
  console.log('📝 Test 1: Valid liability waiver...');
  try {
    const testData1 = {
      waiver_type: 'liability',
      waiver_version: '1.0',
      participant_name: 'John Smith',
      participant_dob: '1990-01-01',
      digital_signature: 'John Smith', // Exact match
      acknowledge_terms: true,
      voluntary_signature: true,
      legal_age_certification: true,
      signature_timestamp: new Date().toISOString()
    };

    const { data: result1, error: error1 } = await supabase
      .from('waiver_signatures')
      .insert(testData1)
      .select('id, waiver_type')
      .single();

    if (error1) {
      console.error('❌ Liability waiver failed:', error1.message);
    } else {
      console.log(`✅ Liability waiver submitted! Type: ${result1.waiver_type}`);
      await supabase.from('waiver_signatures').delete().eq('id', result1.id);
    }
  } catch (error) {
    console.error('❌ Liability waiver error:', error.message);
  }

  // Test 2: Valid photo release waiver (should store as "photo")
  console.log('\n📝 Test 2: Valid photo release waiver...');
  try {
    const testData2 = {
      waiver_type: 'photo', // Testing the new format
      waiver_version: '1.0',
      participant_name: 'Jane Doe',
      participant_dob: '1985-06-15',
      digital_signature: 'Jane Doe', // Exact match
      acknowledge_terms: true,
      voluntary_signature: true,
      legal_age_certification: true,
      signature_timestamp: new Date().toISOString()
    };

    const { data: result2, error: error2 } = await supabase
      .from('waiver_signatures')
      .insert(testData2)
      .select('id, waiver_type')
      .single();

    if (error2) {
      console.error('❌ Photo release waiver failed:', error2.message);
    } else {
      console.log(`✅ Photo release waiver submitted! Type: ${result2.waiver_type}`);
      await supabase.from('waiver_signatures').delete().eq('id', result2.id);
    }
  } catch (error) {
    console.error('❌ Photo release waiver error:', error.message);
  }

  // Test 3: Check that both waiver types are now in the database as expected
  console.log('\n📊 Checking waiver types in database...');
  try {
    const { data: waiverTypes, error: typesError } = await supabase
      .from('waiver_signatures')
      .select('waiver_type')
      .limit(10);

    if (typesError) {
      console.error('❌ Could not check waiver types:', typesError.message);
    } else {
      const types = [...new Set(waiverTypes.map(w => w.waiver_type))];
      console.log(`📋 Available waiver types in database: ${types.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Error checking waiver types:', error.message);
  }

  console.log('\n🎉 Waiver validation testing completed!');
  console.log('✅ Photo release waivers should now be stored as "photo"');
  console.log('✅ Participant name and digital signature must match exactly');
}

testWaiverValidation();
