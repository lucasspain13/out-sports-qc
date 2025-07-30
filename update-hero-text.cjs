const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function updateHeroText() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

  // First check current content
  console.log('Checking current hero content...');
  const { data: current, error: readError } = await supabase
    .from('hero_content')
    .select('*')
    .eq('page', 'home');

  if (readError) {
    console.error('Error reading:', readError);
  } else {
    console.log('Current home hero content:', JSON.stringify(current, null, 2));
  }

  // Update to new text
  console.log('Updating hero content...');
  const { data: updated, error: updateError } = await supabase
    .from('hero_content')
    .update({ primary_cta_text: 'Register for Fall Kickball' })
    .eq('page', 'home')
    .select();

  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Updated hero content:', JSON.stringify(updated, null, 2));
  }
}

updateHeroText().catch(console.error);
