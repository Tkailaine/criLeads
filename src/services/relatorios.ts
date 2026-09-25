import { supabase } from '../lib/supabase'

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