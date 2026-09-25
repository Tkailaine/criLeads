import { useEffect, useState } from 'react'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [LeadsPorOrigem, setLeadsPorOrigem] = useState<LeadsPorOrigem[]>([])
    const [LeadsQualificadosOrigem, setLeadsQualificadosOrigem] = useState<QualificacaoPorOrigem[]>([])

    useEffect(() => {
        async function carregarLeads() {
            try {
                const dados = await buscarLeads()
                setLeads(dados ?? [])

                const dadosOrigem = await buscarLeadsPorOrigem()
                setLeadsPorOrigem(dadosOrigem ?? [])

                const dadosQualificadosOrigem = await buscarLeadsPercentualQualificadosOrigem()
                setLeadsQualificadosOrigem(dadosQualificadosOrigem ?? [])
            } catch (error) {
                console.error(error)
            }
        }

        carregarLeads()
    }, [])

    return (
        <main>
            <h1>Dashboard</h1>

            <section>
                <Indicadores leads={leads} />
                <TabelaLeads leads={leads} />
            </section>


            {/* Relatório de leads por origem */}
            <section>

                <h2>Leads por origem</h2>

                {LeadsPorOrigem.map((item) => (
                    <p key={item.origem}>
                        {item.origem}: {item.total_leads} leads
                    </p>
                ))}
            </section>

            {/* Relatório de Qualificação por origem */}
            <section>
                <h2>Qualificação por origem</h2>

                {LeadsQualificadosOrigem.map((item) => (
                    <p key={item.origem}>
                        {item.origem}: {item.total_qualificados} qualificados de {item.total_leads}
                        {' '}({item.percentual_qualificados}%)
                    </p>
                ))}
            </section>
        </main>
    )
}