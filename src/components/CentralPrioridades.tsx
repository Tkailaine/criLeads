import type { Lead } from '../services/leads'
import { calcularDiasSemContato } from '../utils/acompanhamento'
import { formatarIntencao, formatarOrigem, formatarTexto, formatarStatus } from '../utils/formatters'

//Tipagem das propriedades recebidas pelo componente principal
type CentralPrioridadesProps = {
    leads: Lead[]
    onVerLead?: (lead: Lead) => void
}

//Tipagem das propriedades do card individual de prioridade
type CardPrioridadeLeadProps = {
    lead: Lead
    onVerLead?: (lead: Lead) => void
}

//Coloca peso para a intenção de compra como critério de desempate
function pesoIntencao(intencao?: string | null): number {
    if (!intencao) return 1
    const chave = intencao.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    switch (chave) {
        case 'alta':
            return 4
        case 'media':
            return 3
        case 'pesquisando':
            return 2
        default:
            return 1
    }
}

//Utiliza o resumo, a próxima ação e os dados faltantes da análise comercial gerada pela IA
function extrairAnaliseComercial(lead: Lead) {
    const dados = lead as Record<string, any>

    let resumo: string | null = null
    let proxima_acao: string | null = null
    let dados_faltantes: string[] = []

    //1. Busca direto no objeto caso os dados estejam em colunas na raiz do lead
    if (typeof dados.resumo === 'string' && dados.resumo.trim()) {
        resumo = dados.resumo.trim()
    }
    if (typeof dados.proxima_acao === 'string' && dados.proxima_acao.trim()) {
        proxima_acao = dados.proxima_acao.trim()
    }
    if (Array.isArray(dados.dados_faltantes)) {
        dados_faltantes = dados.dados_faltantes.filter((item: any) => typeof item === 'string' && item.trim())
    }

    //2. Busca dentro de analise_comercial caso esteja agrupado em JSON ou objeto
    if (dados.analise_comercial) {
        if (typeof dados.analise_comercial === 'object' && dados.analise_comercial !== null) {
            if (!resumo && typeof dados.analise_comercial.resumo === 'string') {
                resumo = dados.analise_comercial.resumo.trim()
            }
            if (!proxima_acao && typeof dados.analise_comercial.proxima_acao === 'string') {
                proxima_acao = dados.analise_comercial.proxima_acao.trim()
            }
            if (dados_faltantes.length === 0 && Array.isArray(dados.analise_comercial.dados_faltantes)) {
                dados_faltantes = dados.analise_comercial.dados_faltantes.filter((item: any) => typeof item === 'string' && item.trim())
            }
        } else if (typeof dados.analise_comercial === 'string') {
            try {
                const parsed = JSON.parse(dados.analise_comercial)
                if (typeof parsed === 'object' && parsed !== null) {
                    if (!resumo && typeof parsed.resumo === 'string') {
                        resumo = parsed.resumo.trim()
                    }
                    if (!proxima_acao && typeof parsed.proxima_acao === 'string') {
                        proxima_acao = parsed.proxima_acao.trim()
                    }
                    if (dados_faltantes.length === 0 && Array.isArray(parsed.dados_faltantes)) {
                        dados_faltantes = parsed.dados_faltantes.filter((item: any) => typeof item === 'string' && item.trim())
                    }
                } else if (!resumo && typeof parsed === 'string') {
                    resumo = parsed.trim()
                }
            } catch {
                if (!resumo && dados.analise_comercial.trim()) {
                    resumo = dados.analise_comercial.trim()
                }
            }
        }
    }

    //3. Busca dentro de qualificacao caso os dados faltantes estejam nesse grupo
    if (dados_faltantes.length === 0 && dados.qualificacao) {
        if (typeof dados.qualificacao === 'object' && Array.isArray(dados.qualificacao.dados_faltantes)) {
            dados_faltantes = dados.qualificacao.dados_faltantes.filter((item: any) => typeof item === 'string' && item.trim())
        }
    }

    return {
        resumo: resumo || null,
        proxima_acao: proxima_acao || null,
        dados_faltantes: dados_faltantes
    }
}

//Componente para exibir o estado vazio quando não há leads em prioridade
function EstadoVazioPrioridades() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
            <p className="text-xs md:text-sm text-slate-500 font-medium">
                Nenhum lead exige atenção no momento.
            </p>
        </div>
    )
}

//Subcomponente do card do lead prioritário
function CardPrioridadeLead({ lead, onVerLead }: CardPrioridadeLeadProps) {
    const diasSemContato = calcularDiasSemContato(lead.ultimo_contato)
    const analise = extrairAnaliseComercial(lead)

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs flex flex-col justify-between hover:border-[#EE4C01]/40 transition-colors">
            <div className="space-y-4">
                {/* Topo do card: nome, telefone e badge de dias sem contato */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h4 className="text-base md:text-lg font-bold text-[#040136] leading-snug">
                            {lead.nome}
                        </h4>
                        {lead.telefone && (
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                {lead.telefone}
                            </p>
                        )}
                    </div>

                    {diasSemContato !== null && (
                        <span className="shrink-0 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                            {diasSemContato}d sem contato
                        </span>
                    )}
                </div>

                {/* Detalhes do lead: status, intenção, interesse e faixa de valor */}
                <div className="text-xs text-slate-600 space-y-1.5 font-medium pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status:</span>
                        <strong className="text-slate-700">
                            {formatarStatus(lead.status)}
                        </strong>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Intenção:</span>
                        <strong className="text-[#040136]">
                            {formatarIntencao(lead.intencao_compra)}
                        </strong>
                    </div>

                    {(lead.regiao || lead.tipo_imovel) && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Interesse:</span>
                            <span className="text-slate-700 truncate max-w-[180px]">
                                {[formatarTexto(lead.regiao), formatarTexto(lead.tipo_imovel)]
                                    .filter((t) => t !== '-')
                                    .join(' · ') || '-'}
                            </span>
                        </div>
                    )}

                    {lead.faixa_valor && (
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Faixa:</span>
                            <span className="text-slate-800 font-bold">
                                {formatarTexto(lead.faixa_valor)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bloco com o resumo da análise da IA (exibe somente se existir) */}
                {analise.resumo && (
                    <div className="bg-[#F8F9FB] rounded-xl p-3 border border-slate-200/70">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Análise da IA
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-2" title={analise.resumo}>
                            {analise.resumo}
                        </p>
                    </div>
                )}

                {/* Bloco com a próxima ação recomendada (destaque visual maior para a ação comercial) */}
                {analise.proxima_acao && (
                    <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/80 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]" />
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                                Próxima ação
                            </p>
                        </div>
                        <p className="text-xs text-slate-900 leading-relaxed font-semibold line-clamp-2" title={analise.proxima_acao}>
                            {analise.proxima_acao}
                        </p>
                    </div>
                )}

                {/* Bloco de dados faltantes para qualificação (exibe somente se existirem itens) */}
                {analise.dados_faltantes.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Dados a qualificar
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {analise.dados_faltantes.map((item, index) => (
                                <span
                                    key={index}
                                    className="text-[10px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Rodapé com a origem e botão para ver o lead */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-400">
                    Origem: <strong className="text-slate-600">{formatarOrigem(lead.origem)}</strong>
                </span>

                {/* Botão que aciona a função do componente pai para abrir o modal do lead */}
                <button
                    type="button"
                    onClick={() => onVerLead?.(lead)}
                    className="text-xs font-bold text-[#040136] bg-[#F4F5F8] hover:bg-[#EE4C01] hover:text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                    <span>Ver lead</span>
                    <span>→</span>
                </button>
            </div>
        </div>
    )
}

//Componente principal exportado para a página de atenção
export default function CentralPrioridades({ leads, onVerLead }: CentralPrioridadesProps) {
    //Ordena os leads: 1º quem tem mais dias sem contato, 2º maior intenção de compra
    const leadsPrioritarios = [...leads]
        .sort((a, b) => {
            const diasA = calcularDiasSemContato(a.ultimo_contato) ?? 0
            const diasB = calcularDiasSemContato(b.ultimo_contato) ?? 0

            //1. Maior quantidade de dias sem contato primeiro (ex: 9 dias antes de 7)
            if (diasB !== diasA) {
                return diasB - diasA
            }

            //2. Desempate pela maior intenção de compra
            return pesoIntencao(b.intencao_compra) - pesoIntencao(a.intencao_compra)
        })
        .slice(0, 3) //Pega no máximo os 3 primeiros leads

    return (
        <section className="space-y-4">
            {/* Cabeçalho da seção */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#EE4C01]">
                        Ação Recomendada
                    </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#040136]">
                    Prioridades de hoje
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-normal">
                    Leads que exigem acompanhamento e a próxima ação recomendada.
                </p>
            </div>

            {/* Renderiza estado vazio ou lista de cards componetizados */}
            {leadsPrioritarios.length === 0 ? (
                <EstadoVazioPrioridades />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {leadsPrioritarios.map((lead) => (
                        <CardPrioridadeLead
                            key={lead.id}
                            lead={lead}
                            onVerLead={onVerLead}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
