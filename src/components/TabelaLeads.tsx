import type { Lead } from '../services/leads'
import { useState } from 'react'
import { formatarOrigem, formatarStatus, formatarData, formatarTexto, formatarIntencao } from '../utils/formatters'
import { classificarAcompanhamento, calcularDiasSemContato } from '../utils/acompanhamento'
import ModalLead from './ModalLead'



type TabelaLeadsProps = {
    leads: Lead[]
}

export default function TabelaLeads({ leads }: TabelaLeadsProps) {
    const [filtroStatus, setFiltroStatus] = useState('')
    const [filtroOrigem, setFiltroOrigem] = useState('')
    const [filtroIntencao, setFiltroIntencao] = useState('')
    const [filtroFaixaValor, setFiltroFaixaValor] = useState('')
    const [filtroRegiao, setFiltroRegiao] = useState('')

    const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)

    const statusList = [...new Set(leads.map((lead) => lead.status?.toLowerCase().trim()).filter((item): item is string => Boolean(item)))]
    const origens = [...new Set(leads.map((lead) => lead.origem?.toLowerCase().trim()).filter((item): item is string => Boolean(item)))]
    const intencoes = [...new Set(leads.map((lead) => lead.intencao_compra?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')).filter((item): item is string => Boolean(item)))]
    const faixasValor = [...new Set(leads.map((lead) => lead.faixa_valor?.toLowerCase().trim()).filter((item): item is string => Boolean(item)))]
    const regioes = [...new Set(leads.map((lead) => lead.regiao?.toLowerCase().trim()).filter((item): item is string => Boolean(item)))]

    //Paginação da tabela de leads (10 por página)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const itensPorPagina = 10

    // Filtra leads com base nos filtros selecionados mantendo valores internos
    const leadsFiltrados = leads.filter((lead) => {
        const correspondeStatus = !filtroStatus || lead.status?.toLowerCase().trim() === filtroStatus
        const correspondeOrigem = !filtroOrigem || lead.origem?.toLowerCase().trim() === filtroOrigem
        const correspondeIntencao = !filtroIntencao || lead.intencao_compra?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === filtroIntencao
        const correspondeFaixaValor = !filtroFaixaValor || lead.faixa_valor?.toLowerCase().trim() === filtroFaixaValor
        const correspondeRegiao = !filtroRegiao || lead.regiao?.toLowerCase().trim() === filtroRegiao

        return (
            correspondeStatus &&
            correspondeOrigem &&
            correspondeIntencao &&
            correspondeFaixaValor &&
            correspondeRegiao
        )
    })

    //Calcula o total de páginas e leads para a página atual
    const totalItens = leadsFiltrados.length
    const totalPaginas = Math.ceil(totalItens / itensPorPagina) || 1
    const inicioIndex = (paginaAtual - 1) * itensPorPagina
    const fimIndex = Math.min(inicioIndex + itensPorPagina, totalItens)
    const leadsPaginados = leadsFiltrados.slice(inicioIndex, fimIndex)

    //Limpa todos os filtros e volta para a primeira página
    const limparFiltros = () => {
        setFiltroStatus('')
        setFiltroOrigem('')
        setFiltroIntencao('')
        setFiltroFaixaValor('')
        setFiltroRegiao('')
        setPaginaAtual(1)
    }

    const temFiltroAtivo = Boolean(filtroStatus || filtroOrigem || filtroIntencao || filtroFaixaValor || filtroRegiao)

    const renderStatusBadge = (status: string) => {
        const chave = status?.toLowerCase()
        switch (chave) {
            case 'novo':
                return (
                    <span className="inline-flex items-center gap-2 font-bold text-[#EE4C01]">
                        <span className="w-2 h-2 rounded-full bg-[#EE4C01]"></span>
                        {formatarStatus(status)}
                    </span>
                )
            case 'em_contato':
                return (
                    <span className="inline-flex items-center gap-2 font-bold text-[#2201B2]">
                        <span className="w-2 h-2 rounded-full bg-[#2201B2]"></span>
                        {formatarStatus(status)}
                    </span>
                )
            case 'qualificado':
                return (
                    <span className="inline-flex items-center gap-2 font-bold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        {formatarStatus(status)}
                    </span>
                )
            case 'perdido':
                return (
                    <span className="inline-flex items-center gap-2 font-medium text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        {formatarStatus(status)}
                    </span>
                )
            default:
                return <span className="text-slate-600">{formatarStatus(status)}</span>
        }
    }

    return (
        <div className="space-y-6">
            {temFiltroAtivo && (
                <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-slate-500">
                        Exibindo <strong className="text-[#040136]">{leadsFiltrados.length}</strong> de <strong className="text-[#040136]">{leads.length}</strong> leads
                    </span>

                    <button
                        type="button"
                        onClick={limparFiltros}
                        className="text-xs font-bold text-[#EE4C01] hover:text-[#D84401] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                    >
                        <span>Limpar filtros</span>
                        <span>×</span>
                    </button>
                </div>
            )}

            {/* Painel de Filtros Discreto */}
            <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-slate-200/70 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {/* Status */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Status
                    </label>
                    <select
                        value={filtroStatus}
                        onChange={(e) => {
                            setFiltroStatus(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todos</option>
                        {statusList.map((status) => (
                            <option key={status} value={status}>
                                {formatarStatus(status)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Origem */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Origem
                    </label>
                    <select
                        value={filtroOrigem}
                        onChange={(e) => {
                            setFiltroOrigem(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {origens.map((origem) => (
                            <option key={origem} value={origem}>
                                {formatarOrigem(origem)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Intenção */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Intenção
                    </label>
                    <select
                        value={filtroIntencao}
                        onChange={(e) => {
                            setFiltroIntencao(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {intencoes.map((intencao) => (
                            <option key={intencao} value={intencao}>
                                {formatarIntencao(intencao)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Faixa de Valor */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Faixa de Valor
                    </label>
                    <select
                        value={filtroFaixaValor}
                        onChange={(e) => {
                            setFiltroFaixaValor(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {faixasValor.map((faixa) => (
                            <option key={faixa} value={faixa}>
                                {formatarTexto(faixa)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Região */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Região
                    </label>
                    <select
                        value={filtroRegiao}
                        onChange={(e) => {
                            setFiltroRegiao(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {regioes.map((regiao) => (
                            <option key={regiao} value={regiao}>
                                {formatarTexto(regiao)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabela de Leads */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-700">
                        <thead className="bg-[#F8F9FB] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                            <tr>
                                <th className="py-3.5 px-3 sm:px-4 lg:px-5 text-left font-bold text-[#040136]">
                                    Lead / Contato
                                </th>
                                <th className="py-3.5 px-3 sm:px-4 text-center font-bold text-[#040136] whitespace-nowrap">
                                    Status
                                </th>
                                <th className="hidden md:table-cell py-3.5 px-3 sm:px-4 text-left font-bold text-[#040136] whitespace-nowrap">
                                    Origem
                                </th>
                                <th className="hidden lg:table-cell py-3.5 px-3 sm:px-4 text-left font-bold text-[#040136]">
                                    Imóvel / Região
                                </th>
                                <th className="hidden sm:table-cell py-3.5 px-3 sm:px-4 text-left font-bold text-[#040136] whitespace-nowrap">
                                    Faixa de Valor
                                </th>
                                <th className="hidden sm:table-cell py-3.5 px-3 sm:px-4 text-center font-bold text-[#040136] whitespace-nowrap">
                                    Último Contato
                                </th>
                                <th className="py-3.5 px-3 sm:px-4 text-right font-bold text-[#040136]">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Verifica se tem leads filtrados para exibir */}
                            {leadsPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center text-slate-400">
                                        Nenhum lead encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                /* Renderiza os leads da página atual */
                                leadsPaginados.map((lead) => (
                                    <tr 
                                        key={lead.id} 
                                        onClick={() => setLeadSelecionado(lead)} 
                                        className="hover:bg-[#EE4C01]/5 active:bg-[#EE4C01]/10 cursor-pointer transition-colors group"
                                    >
                                        {/* Lead / Contato */}
                                        <td className="py-3.5 px-3 sm:px-4 lg:px-5 text-left">
                                            <div className="font-bold text-[#040136] text-sm leading-snug group-hover:text-[#EE4C01] transition-colors">
                                                {lead.nome}
                                            </div>
                                            {lead.telefone && (
                                                <div className="text-xs text-slate-500 mt-0.5 font-medium whitespace-nowrap">
                                                    {lead.telefone}
                                                </div>
                                            )}

                                            {/* Micro-tags complementares no mobile */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 md:hidden">
                                                {lead.origem && (
                                                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                        {formatarOrigem(lead.origem)}
                                                    </span>
                                                )}
                                                {lead.regiao && (
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        • {formatarTexto(lead.regiao)}
                                                    </span>
                                                )}
                                                {/* Badge de atenção no mobile se aplicável */}
                                                {(() => {
                                                    if (!lead.ultimo_contato || lead.status === 'perdido') return null
                                                    const statusAcomp = classificarAcompanhamento(lead.ultimo_contato)
                                                    const dias = calcularDiasSemContato(lead.ultimo_contato)
                                                    if (statusAcomp === 'atencao') {
                                                        return (
                                                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                                                                {dias}d sem contato
                                                            </span>
                                                        )
                                                    }
                                                    if (statusAcomp === 'perdido' || (dias && dias >= 10)) {
                                                        return (
                                                            <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                                                                +10d sem contato
                                                            </span>
                                                        )
                                                    }
                                                    return null
                                                })()}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                                            {renderStatusBadge(lead.status)}
                                        </td>

                                        {/* Origem */}
                                        <td className="hidden md:table-cell py-3.5 px-3 sm:px-4 text-left font-semibold text-slate-700 whitespace-nowrap">
                                            <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs">
                                                {formatarOrigem(lead.origem)}
                                            </span>
                                        </td>

                                        {/* Imóvel / Região */}
                                        <td className="hidden lg:table-cell py-3.5 px-3 sm:px-4 text-left">
                                            <div className="font-semibold text-slate-800 text-xs">
                                                {formatarTexto(lead.tipo_imovel)}
                                            </div>
                                            {lead.regiao && (
                                                <div className="text-[11px] text-slate-500 font-normal">
                                                    {formatarTexto(lead.regiao)}
                                                </div>
                                            )}
                                        </td>

                                        {/* Faixa de Valor */}
                                        <td className="hidden sm:table-cell py-3.5 px-3 sm:px-4 text-left">
                                            <div className="font-black text-slate-800 text-xs whitespace-nowrap">
                                                {formatarTexto(lead.faixa_valor)}
                                            </div>
                                            {lead.intencao_compra && (
                                                <div className="text-[11px] text-slate-400 font-normal truncate max-w-[130px]" title={lead.intencao_compra}>
                                                    {formatarIntencao(lead.intencao_compra)}
                                                </div>
                                            )}
                                        </td>

                                        {/* Último Contato */}
                                        <td className="hidden sm:table-cell py-3.5 px-3 sm:px-4 whitespace-nowrap font-medium text-center">
                                            {lead.ultimo_contato ? (
                                                <div className="flex flex-col items-center justify-center gap-0.5">
                                                    <span className="text-slate-700 text-xs font-semibold">
                                                        {formatarData(lead.ultimo_contato)}
                                                    </span>
                                                    {(() => {
                                                        const statusAcomp = classificarAcompanhamento(lead.ultimo_contato)
                                                        const dias = calcularDiasSemContato(lead.ultimo_contato)

                                                        if (statusAcomp === 'atencao' && lead.status !== 'perdido') {
                                                            return (
                                                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-200">
                                                                    {dias}d sem contato
                                                                </span>
                                                            )
                                                        }
                                                        if (statusAcomp === 'perdido' || (dias && dias >= 10)) {
                                                            return (
                                                                <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200">
                                                                    +10d sem contato
                                                                </span>
                                                            )
                                                        }
                                                        return null
                                                    })()}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>

                                        {/* Ação / Detalhes */}
                                        <td className="py-3.5 px-3 sm:px-4 text-right">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#EE4C01]/10 group-hover:text-[#EE4C01] transition-colors text-xs font-bold">
                                                →
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Barra de controle de paginação */}
                    {totalItens > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200/80 bg-[#F8F9FB]/50 text-xs">
                            <span className="text-slate-500 font-medium text-center sm:text-left">
                                Mostrando <strong className="text-[#040136]">{inicioIndex + 1}</strong> a <strong className="text-[#040136]">{fimIndex}</strong> de <strong className="text-[#040136]">{totalItens}</strong> leads
                            </span>

                            <div className="flex items-center gap-2">
                                {/* Botão para página anterior */}
                                <button
                                    type="button"
                                    onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                                    disabled={paginaAtual === 1}
                                    className="px-3.5 py-2 rounded-xl font-bold bg-white text-[#040136] border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Anterior
                                </button>

                                {/* Indicador de página atual e total */}
                                <span className="font-bold text-[#040136] px-2 whitespace-nowrap">
                                    {paginaAtual} de {totalPaginas}
                                </span>

                                {/* Botão para próxima página */}
                                <button
                                    type="button"
                                    onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                                    disabled={paginaAtual === totalPaginas}
                                    className="px-3.5 py-2 rounded-xl font-bold bg-white text-[#040136] border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Abre modal para o lead selecionado, irá rendenizar todas as informações e mensagem personalizada para o lead */}
                    {leadSelecionado && (
                        <ModalLead
                            lead={leadSelecionado}
                            onClose={() => setLeadSelecionado(null)}
                        />
                    )}
                </div>
            </div>


        </div>
    )
}