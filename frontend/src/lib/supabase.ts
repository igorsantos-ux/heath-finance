import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://qrhrtzveglczlxofexwj.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('Supabase: VITE_SUPABASE_ANON_KEY não encontrada. Uploads não funcionarão.')
}

// Inicializa o cliente apenas se tiver as chaves mínimas ou usa uma string placeholder para evitar crash de compilação/runtime pesado
export const supabase = createClient(
    supabaseUrl, 
    supabaseAnonKey || 'missing-key'
)
