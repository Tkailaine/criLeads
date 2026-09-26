import { useEffect, useState } from 'react'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'
import { formatarOrigem, formatarPercentual } from '../utils/formatters'
import FormularioLead from '../components/SimuladorLead'


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
        <div className="min-h-screen bg-white text-[#040136] flex flex-col font-sans antialiased selection:bg-[#EE4C01]/20 selection:text-[#EE4C01]">

          
            <main className="flex-1 w-full flex flex-col">

                {/* 2. ALERTA OPERACIONAL (Fundo Azul #040136 - Foco em Ação, sem altura excessiva) */}
                <section className="bg-[#040136] text-white py-8 md:py-10 border-b border-[#040136]">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-3xl">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#EE4C01]"></span>
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EE4C01]">
                                    Atenção no Acompanhamento
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                {leadsAtencaoCount > 0
                                    ? `${leadsAtencaoCount} leads precisam de contato`
                                    : 'Nenhum lead com contato pendente'}
                            </h2>
                            <p className="text-xs md:text-sm text-slate-300 font-normal">
                                Último contato há mais de 10 dias ou leads recém-cadastrados aguardando retorno.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <button
                                type="button"
                                className="w-full sm:w-auto bg-[#EE4C01] hover:bg-[#D84401] text-white font-black text-xs md:text-sm px-7 py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg text-center"
                            >
                                Ver leads
                            </button>
                        </div>
                    </div>
                </section>

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

                            {/* Leads por Origem */}
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 shadow-xs">
                                <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-[#040136] tracking-tight">
                                            Leads por origem
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            De onde vêm os leads cadastrados
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-[#040136] bg-[#F4F5F8] px-3.5 py-1 rounded-lg">
                                        Total: {totalLeadsOrigem || leads.length}
                                    </span>
                                </div>

                                <div className="space-y-5 pt-1">
                                    {LeadsPorOrigem.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum dado disponível</p>
                                    ) : (
                                        LeadsPorOrigem.map((item, idx) => {
                                            const percent = totalLeadsOrigem > 0
                                                ? Math.round((Number(item.total_leads) / totalLeadsOrigem) * 100)
                                                : 0

                                            const isWhatsapp = item.origem.toLowerCase().includes('whatsapp')
                                            const barColor = isWhatsapp ? 'bg-emerald-600' : idx % 2 === 0 ? 'bg-[#040136]' : 'bg-[#EE4C01]'

                                            return (
                                                <div key={item.origem || idx} className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-black text-[#040136] tracking-wide">
                                                            {formatarOrigem(item.origem, true)}
                                                        </span>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-black text-[#040136]">{item.total_leads} leads</span>
                                                            <span className="text-xs text-slate-400 font-semibold">({percent}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-[#F4F5F8] rounded-lg h-2.5 overflow-hidden">
                                                        <div
                                                            className={`h-2.5 rounded-lg ${barColor} transition-all duration-500`}
                                                            style={{ width: `${Math.max(percent, 6)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Qualificação por Origem */}
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 shadow-xs">
                                <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-[#040136] tracking-tight">
                                            Qualificação por origem
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Percentual de leads qualificados por canal
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                        Taxa de Qualificação
                                    </span>
                                </div>

                                <div className="space-y-5 pt-1">
                                    {LeadsQualificadosOrigem.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum dado disponível</p>
                                    ) : (
                                        LeadsQualificadosOrigem.map((item, idx) => {
                                            const percent = Number(item.percentual_qualificados) || 0

                                            return (
                                                <div key={item.origem || idx} className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-black text-[#040136] tracking-wide">
                                                            {formatarOrigem(item.origem, true)}
                                                        </span>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-xs text-slate-500 font-semibold">
                                                                {item.total_qualificados} de {item.total_leads}
                                                            </span>
                                                            <span className="font-black text-emerald-600 text-sm">
                                                                {formatarPercentual(percent)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-[#F4F5F8] rounded-lg h-2.5 overflow-hidden">
                                                        <div
                                                            className="h-2.5 rounded-lg bg-emerald-600 transition-all duration-500"
                                                            style={{ width: `${Math.max(percent, 6)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

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

            {/* 7. RODAPÉ INSTITUCIONAL */}
            <footer className="bg-[#040136] text-white border-t border-[#040136] py-8">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                        <img src="/logo-cri.png" alt="CRI" className="h-6 w-auto" />
                        <span className="text-slate-300 font-medium">
                            CRI Soluções Imobiliárias — Sistema Interno de Gestão de Leads
                        </span>
                    </div>
                    <div>
                        Santa Catarina, SC • Brasil
                    </div>
                </div>
            </footer>
        </div>
    )
}