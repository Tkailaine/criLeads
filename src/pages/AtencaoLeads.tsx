import { useEffect, useState } from 'react'
import { buscarLeads, type Lead } from '../services/leads'
import { classificarAcompanhamento } from '../utils/acompanhamento'
import HeroAtencaoLeads from '../components/HeroAtencaoLeads'
import CentralPrioridades from '../components/CentralPrioridades'
import TabelaLeads from '../components/TabelaLeads'
import ModalLead from '../components/ModalLead'

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

// Página de acompanhamento dos leads que precisam de atenção
export default function AtencaoLeads() {
    // Estados para armazenar os leads, controle de aba, carregamento e modal
    const [leads, setLeads] = useState<Lead[]>([])
    const [abaSelecionada, setAbaSelecionada] = useState<'todos' | 'acompanhamento' | 'novos'>('todos')
    const [carregando, setCarregando] = useState(true)
    const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)

    // Busca os dados do Supabase ao carregar a página
    useEffect(() => {
        async function carregarLeads() {
            setCarregando(true)
            try {
                const dados = await buscarLeads()
                setLeads(dados ?? [])
            } catch (error) {
                console.error('Erro ao carregar leads:', error)
            } finally {
                setCarregando(false)
            }
        }

        carregarLeads()
    }, [])

    // Filtra leads em acompanhamento (estritamente 7 a 9 dias sem contato)
    const leadsAcompanhamento = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'atencao'
    })

    // Filtra leads novos ou sem contato registrado (ultimo_contato nulo)
    const leadsNovos = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'sem_contato' || !lead.ultimo_contato
    })

    // Lista os leads da Central de Atenção (Acompanhamento 7-9d + Novos sem contato)
    const leadsTodosAtencao = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'atencao' || classificacao === 'sem_contato' || !lead.ultimo_contato
    })

    // Define os leads a serem exibidos de acordo com a aba selecionada
    const leadsExibidos = abaSelecionada === 'acompanhamento'
        ? leadsAcompanhamento
        : abaSelecionada === 'novos'
            ? leadsNovos
            : leadsTodosAtencao

    return (
        <div className="w-full flex flex-col">
            {/* Componente do topo informativo */}
            <HeroAtencaoLeads
                totalAtencao={leadsTodosAtencao.length}
                carregando={carregando}
            />

            {/* Seção da tabela com os filtros de atenção */}
            <section className="bg-white py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
                    
                    {/* Componente de prioridades com a análise da IA */}
                    {carregando ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                            <CarregandoCard texto="Calculando prioridades e recomendações com IA..." />
                        </div>
                    ) : (
                        <CentralPrioridades
                            leads={leadsAcompanhamento}
                            onVerLead={(lead) => setLeadSelecionado(lead)}
                        />
                    )}

                    <div className="space-y-6">
                        {/* Cabeçalho da seção de Leads em Atenção */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-[#EE4C01]">
                                        Acompanhamento Operacional
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#040136]">
                                    Leads que precisam de atenção
                                </h2>
                                <p className="text-xs md:text-sm text-slate-500 font-normal">
                                    Acompanhe os leads sem contato recente e contatos novos que aguardam atendimento.
                                </p>
                            </div>

                            <div className="self-start sm:self-auto">
                                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 inline-block">
                                    Em atenção: <strong className="text-[#040136]">{leadsTodosAtencao.length}</strong> {leadsTodosAtencao.length === 1 ? 'lead' : 'leads'}
                                </span>
                            </div>
                        </div>

                        {/* Filtros rápidos por abas (Todos, Acompanhamento 7-9d, Novos) */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4">
                            <button
                                type="button"
                                onClick={() => setAbaSelecionada('todos')}
                                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                    abaSelecionada === 'todos'
                                        ? 'bg-[#040136] text-white shadow-sm'
                                        : 'bg-[#F4F5F8] text-slate-600 hover:bg-slate-200/70'
                                }`}
                            >
                                Todos ({leadsTodosAtencao.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setAbaSelecionada('acompanhamento')}
                                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                    abaSelecionada === 'acompanhamento'
                                        ? 'bg-[#040136] text-white shadow-sm'
                                        : 'bg-[#F4F5F8] text-slate-600 hover:bg-slate-200/70'
                                }`}
                            >
                                Atenção (7 a 9 dias) ({leadsAcompanhamento.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setAbaSelecionada('novos')}
                                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                                    abaSelecionada === 'novos'
                                        ? 'bg-[#040136] text-white shadow-sm'
                                        : 'bg-[#F4F5F8] text-slate-600 hover:bg-slate-200/70'
                                }`}
                            >
                                Novos / Sem Contato ({leadsNovos.length})
                            </button>
                        </div>

                        {/* Exibe indicador de carregamento ou a tabela paginada com os leads filtrados */}
                        {carregando ? (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                                <CarregandoCard texto="Carregando leads para acompanhamento..." />
                            </div>
                        ) : (
                            <TabelaLeads leads={leadsExibidos} />
                        )}
                    </div>
                </div>
            </section>

            {/* Modal para exibir os detalhes do lead selecionado */}
            {leadSelecionado && (
                <ModalLead
                    lead={leadSelecionado}
                    onClose={() => setLeadSelecionado(null)}
                />
            )}
        </div>
    )
}
