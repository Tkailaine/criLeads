import { supabase } from '../lib/supabase'

export type Lead = {
    id: string,
    chave_idempotencia: string,
    nome: string,
    telefone: string,
    texto_interesse: string,
    origem: string,
    status: string,
    created_at: string,
    faixa_valor: string | null,
    intencao_compra: string |null,
    regiao: string | null,
    tipo_imovel: string | null,
    ultimo_contato: string | null,
    prioridade: string | null,
    mensagem_sugerida: string | null
}
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