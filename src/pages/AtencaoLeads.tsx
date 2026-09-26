import { useEffect, useState } from 'react'
import { buscarLeads, type Lead } from '../services/leads'
import { classificarAcompanhamento } from '../utils/acompanhamento'
import HeroAtencaoLeads from '../components/HeroAtencaoLeads'
import TabelaLeads from '../components/TabelaLeads'

//Página de acompanhamento dos leads que precisam de atenção
export default function AtencaoLeads() {
    //Estados para armazenar os leads, controle de aba e carregamento
    const [leads, setLeads] = useState<Lead[]>([])
    const [abaSelecionada, setAbaSelecionada] = useState<'todos' | 'acompanhamento' | 'novos'>('todos')
    const [carregando, setCarregando] = useState(true)

    //Busca os dados do Supabase ao carregar a página
    useEffect(() => {
        async function carregarLeads() {
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

    //Filtra leads em acompanhamento (7 a 9 dias sem contato)
    const leadsAcompanhamento = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'atencao'
    })

    //Filtra leads novos ou sem contato registrado
    const leadsNovos = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'sem_contato' || lead.status === 'novo'
    })

    //Lista todos os leads que precisam de atenção (acompanhamento + novos)
    const leadsTodosAtencao = leads.filter((lead) => {
        if (lead.status === 'perdido') return false
        const classificacao = classificarAcompanhamento(lead.ultimo_contato)
        return classificacao === 'atencao' || classificacao === 'sem_contato' || lead.status === 'novo'
    })

    //Define os leads a serem exibidos de acordo com a aba selecionada
    const leadsExibidos = abaSelecionada === 'acompanhamento'
        ? leadsAcompanhamento
        : abaSelecionada === 'novos'
            ? leadsNovos
            : leadsTodosAtencao

    return (
        <main className="flex-1 w-full flex flex-col">
            {/* Componente do topo informativo */}
            <HeroAtencaoLeads
                totalAtencao={leadsTodosAtencao.length}
            />

            {/* Seção da tabela com os filtros de atenção */}
            <section className="bg-white py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-6">
                    
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
                            Todos em Atenção ({leadsTodosAtencao.length})
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
                        <div className="py-20 text-center text-slate-400 font-medium text-sm">
                            Carregando leads para acompanhamento...
                        </div>
                    ) : (
                        <TabelaLeads leads={leadsExibidos} />
                    )}
                </div>
            </section>
        </main>
    )
}
