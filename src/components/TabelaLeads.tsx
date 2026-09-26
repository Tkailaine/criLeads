import type { Lead } from '../services/leads'
import { useState } from 'react'
import { formatarOrigem, formatarStatus } from '../utils/formatters'

type TabelaLeadsProps = {
    leads: Lead[]
}

export default function TabelaLeads({ leads }: TabelaLeadsProps) {
    const [filtroStatus, setFiltroStatus] = useState('')
    const [filtroOrigem, setFiltroOrigem] = useState('')
    const [filtroIntencao, setFiltroIntencao] = useState('')
    const [filtroFaixaValor, setFiltroFaixaValor] = useState('')
    const [filtroRegiao, setFiltroRegiao] = useState('')

    const origens = [...new Set(leads.map((lead) => lead.origem).filter((item): item is string => Boolean(item)))]
    const intencoes = [...new Set(leads.map((lead) => lead.intencao_compra).filter((item): item is string => Boolean(item)))]
    const faixasValor = [...new Set(leads.map((lead) => lead.faixa_valor).filter((item): item is string => Boolean(item)))]
    const regioes = [...new Set(leads.map((lead) => lead.regiao).filter((item): item is string => Boolean(item)))]

    // Filtra leads com base nos filtros selecionados mantendo valores internos
    const leadsFiltrados = leads.filter((lead) => {
        const correspondeStatus = !filtroStatus || lead.status === filtroStatus
        const correspondeOrigem = !filtroOrigem || lead.origem === filtroOrigem
        const correspondeIntencao = !filtroIntencao || lead.intencao_compra === filtroIntencao
        const correspondeFaixaValor = !filtroFaixaValor || lead.faixa_valor === filtroFaixaValor
        const correspondeRegiao = !filtroRegiao || lead.regiao === filtroRegiao

        return (
            correspondeStatus &&
            correspondeOrigem &&
            correspondeIntencao &&
            correspondeFaixaValor &&
            correspondeRegiao
        )
    })

    const limparFiltros = () => {
        setFiltroStatus('')
        setFiltroOrigem('')
        setFiltroIntencao('')
        setFiltroFaixaValor('')
        setFiltroRegiao('')
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
            {/* Cabeçalho da Base de Leads */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#040136] tracking-tight">
                        Base de leads
                    </h2>
                    <p className="text-sm text-slate-500 font-normal mt-0.5">
                        Todos os leads registrados no sistema.
                    </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                    <span className="text-xs font-bold text-[#040136] bg-[#F4F5F8] px-3.5 py-1.5 rounded-xl border border-slate-200/70">
                        {leadsFiltrados.length} {leadsFiltrados.length === 1 ? 'lead' : 'leads'}
                    </span>
                    {temFiltroAtivo && (
                        <button
                            onClick={limparFiltros}
                            className="text-xs font-bold text-[#EE4C01] hover:text-[#D84401] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                        >
                            <span>Limpar filtros</span>
                            <span>×</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Painel de Filtros Discreto */}
            <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-slate-200/70 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {/* Status */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Status
                    </label>
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todos</option>
                        <option value="novo">Novo</option>
                        <option value="em_contato">Em Contato</option>
                        <option value="qualificado">Qualificado</option>
                        <option value="perdido">Perdido</option>
                    </select>
                </div>

                {/* Origem */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Origem
                    </label>
                    <select
                        value={filtroOrigem}
                        onChange={(e) => setFiltroOrigem(e.target.value)}
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
                        onChange={(e) => setFiltroIntencao(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {intencoes.map((intencao) => (
                            <option key={intencao} value={intencao}>
                                {intencao}
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
                        onChange={(e) => setFiltroFaixaValor(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {faixasValor.map((faixa) => (
                            <option key={faixa} value={faixa}>
                                {faixa}
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
                        onChange={(e) => setFiltroRegiao(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#040136]"
                    >
                        <option value="">Todas</option>
                        {regioes.map((regiao) => (
                            <option key={regiao} value={regiao}>
                                {regiao}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabela de Leads */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-[#F8F9FB] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                            <tr>
                                <th className="py-4 px-6 font-bold text-[#040136]">Lead / Contato</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Origem</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Status</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Região</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Tipo de Imóvel</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Faixa de Valor</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Intenção de Compra</th>
                                <th className="py-4 px-6 font-bold text-[#040136]">Último Contato</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leadsFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-14 text-center text-slate-400">
                                        Nenhum lead encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                leadsFiltrados.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-[#040136] text-sm">
                                                {lead.nome}
                                            </div>
                                            {lead.telefone && (
                                                <div className="text-xs text-slate-400 mt-0.5 font-medium">
                                                    {lead.telefone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-700">
                                            {formatarOrigem(lead.origem)}
                                        </td>
                                        <td className="py-4 px-6">
                                            {renderStatusBadge(lead.status)}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">
                                            {lead.regiao || <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">
                                            {lead.tipo_imovel || <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 font-black text-slate-800 whitespace-nowrap">
                                            {lead.faixa_valor || <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 max-w-xs truncate font-medium" title={lead.intencao_compra || ''}>
                                            {lead.intencao_compra || <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 max-w-xs truncate font-medium" title={lead.ultimo_contato || ''}>
                                            {lead.ultimo_contato || <span className="text-slate-300">-</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}