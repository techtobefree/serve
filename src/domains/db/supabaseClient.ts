import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabaseTypes";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

// Conditional configuration based on the platform
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export { supabase };
