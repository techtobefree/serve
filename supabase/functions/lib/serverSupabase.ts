import { createClient } from 'jsr:@supabase/supabase-js@2'

import { Database } from './supabaseTypes.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const serverSupabase = createClient<Database>(supabaseUrl, supabaseKey);

export { serverSupabase };
