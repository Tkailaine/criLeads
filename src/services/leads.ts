import { supabase } from '../lib/supabase'

export type Lead = {
    id: string,
    chave_idempotencia?: string | null,
    nome: string,
    telefone?: string | null,
    texto_interesse?: string | null,
    origem: string,
    status: string,
    created_at: string,
    faixa_valor?: string | null,
    intencao_compra?: string | null,
    regiao?: string | null,
    tipo_imovel?: string | null,
    caracteristicas?: string[] | string | null,
    prazo_compra?: string | null,
    ultimo_contato?: string | null,
    prioridade?: string | null,
    mensagem_sugerida?: string | null,
    analise_comercial?: {
        resumo?: string | null,
        proxima_acao?: string | null,
        dados_faltantes?: string[] | null
    } | string | null,
    qualificacao?: {
        intencao_compra?: string | null,
        dados_faltantes?: string[] | null
    } | string | null,
    dados_extraidos?: {
        regiao?: string | null,
        tipo_imovel?: string | null,
        caracteristicas?: string[] | string | null,
        faixa_valor?: string | null,
        prazo_compra?: string | null
    } | string | null,
    resumo?: string | null,
    proxima_acao?: string | null,
    dados_faltantes?: string[] | string | null
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