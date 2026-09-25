import type { Lead } from '../services/leads'

type IndicadoresProps = {
    leads: Lead[]
}

//Função que calcula KPIS de leads novos, em contato, qualificados e perdidos.
export default function Indicadores({ leads }: IndicadoresProps) {
    const total = leads.length

    const novos = leads.filter((lead) => lead.status === 'novo').length

    const emContato = leads.filter(
        (lead) => lead.status === 'em_contato'
    ).length

    const qualificados = leads.filter(
        (lead) => lead.status === 'qualificado'
    ).length

    const perdidos = leads.filter(
        (lead) => lead.status === 'perdido'
    ).length

    return(
        //Exibe quantidade de leads conforme o status
        <section>
            <h2>Indicadores</h2>
            <p>Total de leads: {total}</p>
            <p>Novos: {novos}</p>
            <p>Em contato: {emContato}</p>
            <p>Qualificados: {qualificados}</p>
            <p>Perdidos: {perdidos}</p>
        </section>
    )

}