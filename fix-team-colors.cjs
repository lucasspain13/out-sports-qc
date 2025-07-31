const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zqkyocwlgjhosojnvyts.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxa3lvY3dsZ2pob3Nvam52eXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MzUzNDIsImV4cCI6MjAzNzExMTM0Mn0.4wXS4aRxSqrKwqrUEUdttT_yJhHvSyLTQqxMu6V4Imc';

const supabase = createClient(supabaseUrl, supabaseKey);

// The color mapping from the convertLegacyGradient function
const colorMap = {
  "teal": "green",
  "purple": "pink",
  "orange": "orange",
  "green": "green", 
  "blue": "blue",
  "pink": "pink",
  "white": "white",
  "black": "black",
  "gray": "gray",
  "brown": "brown",
  "yellow": "yellow",
  "red": "red",
  "cyan": "cyan"
};

async function fixTeamColors() {
  console.log('🎨 Fixing team colors...\n');
  
  try {
    // Get all teams
    const { data: teams, error: fetchError } = await supabase
      .from('teams')
      .select('id, name, gradient');
    
    if (fetchError) {
      console.error('❌ Error fetching teams:', fetchError);
      return;
    }
    
    console.log('Current teams:');
    teams.forEach(team => {
      console.log(`- ${team.name}: ${team.gradient}`);
    });
    
    console.log('\n🔧 Applying color fixes...');
    
    for (const team of teams) {
      const correctColor = colorMap[team.gradient] || team.gradient;
      
      if (correctColor !== team.gradient) {
        console.log(`Updating ${team.name}: ${team.gradient} → ${correctColor}`);
        
        const { error: updateError } = await supabase
          .from('teams')
          .update({ gradient: correctColor })
          .eq('id', team.id);
        
        if (updateError) {
          console.error(`❌ Failed to update ${team.name}:`, updateError.message);
        } else {
          console.log(`✅ Successfully updated ${team.name}`);
        }
      } else {
        console.log(`✓ ${team.name} already has correct color: ${correctColor}`);
      }
    }
    
    console.log('\n🎯 Specific fixes for mentioned teams:');
    
    // Check the specific teams mentioned
    const plastics = teams.find(t => t.name.includes('Plastics'));
    const buntCakes = teams.find(t => t.name.includes('Bunt Cakes'));
    const uhaulStars = teams.find(t => t.name.includes('U-haul All Stars'));
    
    if (plastics) {
      const correctColor = 'pink';
      if (plastics.gradient !== correctColor) {
        console.log(`Fixing Plastics: ${plastics.gradient} → ${correctColor}`);
        const { error } = await supabase
          .from('teams')
          .update({ gradient: correctColor })
          .eq('id', plastics.id);
        if (error) {
          console.error('❌ Failed to fix Plastics:', error.message);
        } else {
          console.log('✅ Fixed Plastics color to pink');
        }
      }
    }
    
    if (buntCakes) {
      const correctColor = 'blue';
      if (buntCakes.gradient !== correctColor) {
        console.log(`Fixing Bunt Cakes: ${buntCakes.gradient} → ${correctColor}`);
        const { error } = await supabase
          .from('teams')
          .update({ gradient: correctColor })
          .eq('id', buntCakes.id);
        if (error) {
          console.error('❌ Failed to fix Bunt Cakes:', error.message);
        } else {
          console.log('✅ Fixed Bunt Cakes color to blue');
        }
      }
    }
    
    if (uhaulStars) {
      const correctColor = 'green';
      if (uhaulStars.gradient !== correctColor) {
        console.log(`Fixing U-haul All Stars: ${uhaulStars.gradient} → ${correctColor}`);
        const { error } = await supabase
          .from('teams')
          .update({ gradient: correctColor })
          .eq('id', uhaulStars.id);
        if (error) {
          console.error('❌ Failed to fix U-haul All Stars:', error.message);
        } else {
          console.log('✅ Fixed U-haul All Stars color to green');
        }
      }
    }
    
    console.log('\n✅ Team color fixes complete!');
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

fixTeamColors();
