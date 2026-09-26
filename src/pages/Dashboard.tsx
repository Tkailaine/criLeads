import { useEffect, useState } from 'react'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'
import LeadsPorOrigemCard from '../components/LeadsPorOrigem'
import FormularioLead from '../components/SimuladorLead'
import AlertaOperacional from '../components/AlertaOperacional'
import QualificacaoPorOrigemCard from '../components/QualificacaoPorOrigemCard'
import InsightsOperacionais from '../components/InsightsOperacionais'
import { classificarAcompanhamento } from '../utils/acompanhamento'


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
                console.error('Erro ao carregar dados do Supabase:', error)
            }
        }

        carregarLeads()
    }, [])

    const totalLeadsOrigem = LeadsPorOrigem.reduce((acc, item) => acc + Number(item.total_leads || 0), 0)
    const leadsAtencaoCount = leads.filter(l => {
        //Não considera leads perdidos para alerta de atenção, apenas os novos, prioridade alta e sem contato por quase 10 dias
        if (l.status === 'perdido') return false
        const nivelAcompanhamento = classificarAcompanhamento(l.ultimo_contato)
        return (
            l.status === 'novo' ||
            l.prioridade === 'alta' ||
            nivelAcompanhamento === 'atencao'
        )
    }).length


    return (
        <>

            <main className="flex-1 w-full flex flex-col">
                {/* Alerta de leads que precisam de contato (Fundo azul #040136) */}
                <AlertaOperacional leadsAtencaoCount={leadsAtencaoCount} />


                {/* INDICADORES (Fundo Branco) */}
                <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <Indicadores leads={leads} />
                    </div>
                </section>

                {/* LEADS POR ORIGEM & QUALIFICAÇÃO + INSIGHTS (Fundo Claro #F8F9FB) */}
                <section className="bg-[#F8F9FB] py-12 md:py-16 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/*Leads por origem em gráfico */}
                            <LeadsPorOrigemCard dados={LeadsPorOrigem} totalLeads={totalLeadsOrigem || leads.length} />
                            <QualificacaoPorOrigemCard dados={LeadsQualificadosOrigem} />
                        </div>

                        {/* Insights Operacionais (Direto, sem buzzwords) */}
                        <InsightsOperacionais leadsAtencaoCount={leadsAtencaoCount} />

                    </div>
                </section>

                {/* 5. SIMULAR NOVO LEAD (Fundo Azul #040136 - Operacional e Direto) */}
                <section className="bg-[#040136] text-white py-12 md:py-16 border-b border-[#040136]">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
                        <div className="max-w-2xl space-y-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EE4C01]">
                                Simulação
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                Simular novo lead
                            </h2>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                                Insira uma mensagem para testar a classificação do lead.
                            </p>
                        </div>

                        {/*Formulário para testar o processamento do lead via webhook */}
                        <FormularioLead />
                    </div>
                </section>

                {/* 6. BASE DE LEADS (Fundo Branco) */}
                <section className="bg-white py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <TabelaLeads leads={leads} />
                    </div>
                </section>

            </main>


        </>
    )
}