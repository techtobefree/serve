import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log(supabaseUrl, )
  throw new Error("Missing Supabase URL or Anon Key");
}

// Conditional configuration based on the platform
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
