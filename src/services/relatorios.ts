import { supabase } from '../lib/supabase'

export type LeadsPorOrigem = {
    origem: string,
    total_leads: number
}

export type QualificacaoPorOrigem = {
    origem: string,
    total_leads: number,
    total_qualificados: number,
    percentual_qualificados: number
}

/*
Lista a quantidade de leads por origem que foi calculado direto no supabase, usando uma view:

CREATE VIEW public.leads_por_origem AS
SELECT
    origem,
    COUNT(*) AS total_leads
FROM public.leads
GROUP BY origem
ORDER BY total_leads DESC;

*/

export async function buscarLeadsPorOrigem() {
    const { data, error } = await supabase.from('leads_por_origem').select('*')

    if (error) {
        throw error
    }

    return data

}


/*
    Lista os leads qualificados por origem e porcentagem através da view no supabase
    
    CREATE VIEW public.percentual_qualificados_por_origem AS
SELECT
    origem,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status = 'qualificado') AS total_qualificados,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'qualificado') * 100.0
        / COUNT(*),
        2
    ) AS percentual_qualificados
FROM public.leads
GROUP BY origem
ORDER BY percentual_qualificados DESC; */

export async function buscarLeadsPercentualQualificadosOrigem(){
    const { data,  error } = await supabase.from('percentual_qualificados_por_origem').select('*')
    if (error){
        throw error
    }
    return data
}