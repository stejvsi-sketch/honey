import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const term = "didn't send";
  const orQuery = `message.ilike.%${term}%`;
  
  const { data, error } = await supabase.from('memories').select('message').or(orQuery).limit(2);
  
  console.log("Error:", error);
  console.log("Data count:", data?.length);
  console.log("Data:", data);
}

test();
