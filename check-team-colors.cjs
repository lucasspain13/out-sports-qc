const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zqkyocwlgjhosojnvyts.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxa3lvY3dsZ2pob3Nvam52eXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MzUzNDIsImV4cCI6MjAzNzExMTM0Mn0.4wXS4aRxSqrKwqrUEUdttT_yJhHvSyLTQqxMu6V4Imc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTeamColors() {
  console.log('🎨 Checking current team colors and finding constraint issues...\n');
  
  try {
    // First, let's see what values are currently in the database
    const { data: teams, error } = await supabase
      .from('teams')
      .select('name, gradient')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching teams:', error);
      return;
    }
    
    console.log('Current team colors:');
    teams.forEach(team => {
      console.log(`- ${team.name}: ${team.gradient}`);
    });
    
    console.log('\n🔍 Issues to fix:');
    
    teams.forEach(team => {
      if (team.name.includes('Plastics') && team.gradient !== 'pink') {
        console.log(`❌ ${team.name} should be pink, currently: ${team.gradient}`);
      }
      if (team.name.includes('Bunt Cakes') && team.gradient !== 'blue') {
        console.log(`❌ ${team.name} should be blue, currently: ${team.gradient}`);
      }
      if (team.name.includes('U-haul All Stars') && team.gradient !== 'green') {
        console.log(`❌ ${team.name} should be green, currently: ${team.gradient}`);
      }
    });
    
    console.log('\n📋 Unique gradient values currently in use:');
    const uniqueGradients = [...new Set(teams.map(t => t.gradient))];
    uniqueGradients.forEach(gradient => {
      console.log(`- ${gradient}`);
    });
    
    console.log('\n🧪 Testing if new gradient values work...');
    
    // Try to find a team we can safely test with
    const testTeam = teams.find(team => team.name.includes('Plastics'));
    if (testTeam) {
      console.log(`Testing with team: ${testTeam.name}`);
      
      // Test different gradient values to see what's allowed
      const testGradients = ['pink', 'purple', 'magenta', 'rose'];
      
      for (const gradient of testGradients) {
        try {
          console.log(`  Trying gradient: ${gradient}...`);
          
          // This won't actually update, we'll catch the error
          const { error: testError } = await supabase
            .from('teams')
            .update({ gradient: gradient })
            .eq('id', 'test-id-that-does-not-exist'); // Use fake ID to avoid actual updates
          
          if (testError) {
            if (testError.message.includes('teams_gradient_check')) {
              console.log(`    ❌ ${gradient} is NOT allowed by constraint`);
            } else {
              console.log(`    ✅ ${gradient} passed constraint check (other error: ${testError.message})`);
            }
          }
        } catch (err) {
          console.log(`    ❌ ${gradient} failed with error: ${err.message}`);
        }
      }
    }
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

checkTeamColors();
