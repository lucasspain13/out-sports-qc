const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zqkyocwlgjhosojnvyts.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxa3lvY3dsZ2pob3Nvam52eXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MzUzNDIsImV4cCI6MjAzNzExMTM0Mn0.4wXS4aRxSqrKwqrUEUdttT_yJhHvSyLTQqxMu6V4Imc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTeamColors() {
  console.log('🎨 Checking current team colors...\n');
  
  try {
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
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

checkTeamColors();
