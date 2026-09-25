import { supabase } from '../lib/supabase'
//Função para buscar os leads no supabase, ordena por data de criação mais recente.
export async function buscarLeads() {
    const { data, error } = await 
    supabase.from('leads').select('*').order('created_at', { ascending: false } );

    //Em caso de erro, não ficará silencioso.
    if (error) {
        throw error;
    }
    
    return data
}