import { useEffect, useState } from 'react'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'
import LeadsPorOrigemCard from '../components/LeadsPorOrigem'
import FormularioLead from '../components/SimuladorLead'
import AlertaOperacional from '../components/AlertaOperacional'


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
    const leadsAtencaoCount = leads.filter(l => l.status === 'novo' || l.prioridade === 'alta').length


    return (
        <>

            <main className="flex-1 w-full flex flex-col">
                {/* Alerta de leads que precisam de contato */}
                <AlertaOperacional leadsAtencaoCount={leadsAtencaoCount} />

                {/* 3. INDICADORES (Fundo Branco) */}
                <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <Indicadores leads={leads} />
                    </div>
                </section>

                {/* 4. LEADS POR ORIGEM & QUALIFICAÇÃO + INSIGHTS (Fundo Claro #F8F9FB) */}
                <section className="bg-[#F8F9FB] py-12 md:py-16 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/*Leads por origem em gráfico */}
                            <LeadsPorOrigemCard dados={LeadsPorOrigem} totalLeads={totalLeadsOrigem || leads.length} />
                        </div>
                        {/* Insights Operacionais (Direto, sem buzzwords) */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                                Insights da Carteira
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        <strong className="text-[#040136]">Indicação</strong> tem a maior taxa de qualificação: <strong>60%</strong>.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#2201B2] shrink-0 mt-1.5"></span>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        <strong className="text-[#040136]">WhatsApp</strong> concentra o maior volume de novos contatos.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-[#EE4C01] shrink-0 mt-1.5"></span>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        <strong className="text-[#040136]">{leadsAtencaoCount} leads</strong> exigem contato imediato para evitar perda de negócio.
                                    </p>
                                </div>
                            </div>
                        </div>

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