import { useEffect, useState } from 'react'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'
import LeadsPorOrigemCard from '../components/LeadsPorOrigem'
import FormularioLead from '../components/SimuladorLead'
import AlertaOperacional from '../components/AlertaOperacional'
import QualificacaoPorOrigemCard from '../components/QualificacaoPorOrigemCard'
import { classificarAcompanhamento } from '../utils/acompanhamento'
import RecomendacoesCarteira from '../components/RecomendacoesCarteira'


// Componente de carregamento elegante e moderno
function CarregandoCard({ texto = 'Carregando dados...' }: { texto?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3.5 py-12 px-6 text-center">
            <div className="relative flex items-center justify-center">
                {/* Efeito sutil de expansão (pulse) */}
                <div className="w-11 h-11 rounded-full border-2 border-[#EE4C01]/25 animate-ping absolute" />
                {/* Spinner moderno de duas cores */}
                <div className="w-11 h-11 rounded-full border-3 border-slate-200 border-t-[#EE4C01] border-r-[#040136] animate-spin" />
            </div>
            <p className="text-xs md:text-sm font-bold text-[#040136] tracking-tight mt-1">
                {texto}
            </p>
        </div>
    )
}

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [LeadsPorOrigem, setLeadsPorOrigem] = useState<LeadsPorOrigem[]>([])
    const [LeadsQualificadosOrigem, setLeadsQualificadosOrigem] = useState<QualificacaoPorOrigem[]>([])
    const [carregando, setCarregando] = useState(true)

    // Função para buscar e atualizar todos os dados do Supabase no dashboard
    async function carregarDashboard() {
        setCarregando(true)
        try {
            const dados = await buscarLeads()
            setLeads(dados ?? [])

            const dadosOrigem = await buscarLeadsPorOrigem()
            setLeadsPorOrigem(dadosOrigem ?? [])

            const dadosQualificadosOrigem = await buscarLeadsPercentualQualificadosOrigem()
            setLeadsQualificadosOrigem(dadosQualificadosOrigem ?? [])
        } catch (error) {
            console.error('Erro ao carregar dados do Supabase:', error)
        } finally {
            setCarregando(false)
        }
    }

    // Carrega os dados ao montar o componente
    useEffect(() => {
        carregarDashboard()
    }, [])

    const totalLeadsOrigem = LeadsPorOrigem.reduce((acc, item) => acc + Number(item.total_leads || 0), 0)
    // Contagem de leads próximos do limite de 10 dias (7 a 9 dias sem contato)
    const leadsAtencaoCount = leads.filter(l => {
        if (l.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(l.ultimo_contato)
        return classificacao === 'atencao'
    }).length


    return (
        <div className="w-full flex flex-col">
            {/* Alerta de leads que precisam de contato (Fundo azul #040136) */}
            <AlertaOperacional leadsAtencaoCount={leadsAtencaoCount} carregando={carregando} />


            {/* INDICADORES (Fundo Branco) */}
            <section className="bg-white py-12 md:py-16 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {carregando ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                            <CarregandoCard texto="Carregando e calculando indicadores..." />
                        </div>
                    ) : (
                        <Indicadores leads={leads} />
                    )}
                </div>
            </section>

            {/* LEADS POR ORIGEM & QUALIFICAÇÃO + RECOMENDAÇÕES (Fundo Claro #F8F9FB) */}
            <section className="bg-[#F8F9FB] py-12 md:py-16 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
                    {carregando ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                                    <CarregandoCard texto="Carregando leads por origem..." />
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                                    <CarregandoCard texto="Calculando taxas de qualificação..." />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                                <CarregandoCard texto="Analisando padrões e calculando recomendações..." />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Leads por origem em gráfico */}
                                <LeadsPorOrigemCard dados={LeadsPorOrigem} totalLeads={totalLeadsOrigem || leads.length} />
                                <QualificacaoPorOrigemCard dados={LeadsQualificadosOrigem} />
                            </div>

                            <RecomendacoesCarteira leads={leads} leadsAtencaoCount={leadsAtencaoCount} qualificacaoPorOrigem={LeadsQualificadosOrigem} />
                        </>
                    )}
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

                    {/* Formulário para testar o processamento do lead via webhook */}
                    <FormularioLead onLeadCriado={carregarDashboard} />
                </div>
            </section>

            {/* 6. BASE DE LEADS (Fundo Branco) */}
            <section className="bg-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
                    {/* Cabeçalho da Base de Leads */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#EE4C01]">
                                    Base de Contatos
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#040136]">
                                Base de Leads
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500 font-normal">
                                Acompanhe, filtre e gerencie todos os leads cadastrados no sistema.
                            </p>
                        </div>

                        <div className="self-start sm:self-auto">
                            <span className="text-xs font-semibold text-slate-600 bg-[#F4F5F8] px-3.5 py-2 rounded-xl border border-slate-200 inline-block">
                                Total: <strong className="text-[#040136]">{leads.length}</strong> {leads.length === 1 ? 'lead' : 'leads'}
                            </span>
                        </div>
                    </div>

                    {carregando ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                            <CarregandoCard texto="Carregando base de leads..." />
                        </div>
                    ) : (
                        <TabelaLeads leads={leads} />
                    )}
                </div>
            </section>
        </div>
    )
}