import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Cria o cliente do supabase para poder fazer consultas com fallback seguro caso o .env esteja sendo carregado
export const supabase = createClient(supabaseUrl, supabasePublishableKey)