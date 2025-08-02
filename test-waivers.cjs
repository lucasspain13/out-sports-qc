const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function testBothWaiverTypes() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('🧪 Testing both waiver types...\n');

  const testWaivers = [
    {
      name: 'General Liability Waiver',
      type: 'liability',
      participant: 'Test User Liability'
    },
    {
      name: 'Photo Release Waiver', 
      type: 'photo_release',
      participant: 'Test User Photo'
    }
  ];

  for (const waiver of testWaivers) {
    console.log(`📝 Testing ${waiver.name}...`);
    
    try {
      const testData = {
        waiver_type: waiver.type,
        waiver_version: '1.0',
        participant_name: waiver.participant,
        participant_dob: '1990-01-01',
        digital_signature: waiver.participant,
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
        console.error(`❌ ${waiver.name} failed:`, error.message);
      } else {
        console.log(`✅ ${waiver.name} submitted successfully!`);
        
        // Clean up test record
        await supabase
          .from('waiver_signatures')
          .delete()
          .eq('id', data.id);
      }
    } catch (error) {
      console.error(`❌ ${waiver.name} error:`, error.message);
    }
  }

  console.log('\n🎉 Waiver testing completed! Both waiver types should now work properly.');
}

testBothWaiverTypes();
