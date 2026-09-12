import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Retrieve environment keys using string bracket notation to satisfy strict linter configurations
const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env["VITE_SUPABASE_URL"] : "") || 
  (typeof process !== 'undefined' && process.env ? process.env["VITE_SUPABASE_URL"] : "") || 
  "";

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env["VITE_SUPABASE_ANON_KEY"] : "") || 
  (typeof process !== 'undefined' && process.env ? process.env["VITE_SUPABASE_ANON_KEY"] : "") || 
  "";

// Fallback safety layer to prevent server initialization panics on edge runtimes
const finalUrl = supabaseUrl || "https://supabase.co";
const finalAnonKey = supabaseAnonKey || "sb_publishable_MTRH-nKeDEKoYaIatRkMcA__7GdcazH";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase Engine] Runtime environment variables missing. Falling back to built-in project variables."
  );
}

export const supabase = createClient<Database>(finalUrl, finalAnonKey);
