import type { Lead } from '../services/leads'
import { formatarOrigem, formatarTexto, formatarStatus, formatarData, formatarIntencao, formatarRegiao, formatarFaixaValor, extrairDadosIA } from '../utils/formatters'

type ModalLeadProps = {
    lead: Lead
    onClose: () => void
}

export default function ModalLead({ lead, onClose }: ModalLeadProps) {
    const analise = extrairDadosIA(lead)

    const renderIntencaoBadge = (intencao?: string | null) => {
        if (!intencao) {
            return <span className="text-xs text-slate-400 font-medium italic">-</span>
        }

        const chave = intencao.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        switch (chave) {
            case 'alta':
                return (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#EE4C01] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/80 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            case 'media':
                return (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#2201B2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2201B2]"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            case 'pesquisando':
                return (
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            case 'nao_identificada':
            case 'nao_identificado':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#040136]/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 shrink-0 bg-white">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Detalhes do Lead
                        </p>

                        <h3 className="text-2xl font-black text-[#040136] mt-1">
                            {lead.nome}
                        </h3>

                        {lead.telefone && (
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                {lead.telefone}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                            <span className="text-slate-500">
                                Origem: <strong className="text-slate-800">{formatarOrigem(lead.origem)}</strong>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">
                                Status: <strong className="text-slate-800">{formatarStatus(lead.status)}</strong>
                            </span>
                            {lead.created_at && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-500">
                                        Criado em: <strong className="text-slate-800">{formatarData(lead.created_at)}</strong>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Conteúdo rolável */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Seção Análise da IA */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#040136]">
                                Análise da IA
                            </h4>
                        </div>

                        {/* 1. DADOS EXTRAÍDOS */}
                        <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200/80 p-5 space-y-4">
                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                Dados Extraídos
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase text-slate-600">
                                        Região
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {formatarRegiao(analise.regiao || lead.regiao)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase text-slate-600">
                                        Tipo de Imóvel
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {formatarTexto(analise.tipo_imovel || lead.tipo_imovel)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase text-slate-600">
                                        Faixa de Valor
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {formatarFaixaValor(analise.faixa_valor || lead.faixa_valor)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase text-slate-600">
                                        Prazo de Compra
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {formatarTexto(analise.prazo_compra || lead.prazo_compra)}
                                    </p>
                                </div>
                            </div>

                            {/* Características */}
                            <div className="pt-3 border-t border-slate-200/70">
                                <p className="text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                                    Características
                                </p>
                                {analise.caracteristicas.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {analise.caracteristicas.map((item, index) => (
                                             <span
                                                key={index}
                                                className="text-xs font-semibold bg-white text-slate-800 px-3 py-1 rounded-lg border border-slate-200 shadow-xs"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 font-medium">
                                        Nenhuma característica específica identificada.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 2. QUALIFICAÇÃO */}
                        <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200/80 p-5 space-y-4">
                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                Qualificação
                            </p>

                            <div>
                                <p className="text-[11px] font-bold uppercase text-slate-600 mb-1">
                                    Intenção de Compra
                                </p>
                                <div>
                                    {renderIntencaoBadge(analise.intencao_compra || lead.intencao_compra)}
                                </div>
                            </div>

                            {/* Dados Faltantes */}
                            <div className="pt-3 border-t border-slate-200/70">
                                <p className="text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                                    Dados Faltantes
                                </p>
                                {analise.dados_faltantes.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {analise.dados_faltantes.map((item, index) => (
                                            <span
                                                key={index}
                                                className="text-xs font-semibold bg-white text-amber-900 px-3 py-1 rounded-lg border border-amber-200 shadow-xs"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 font-medium">
                                        Nenhum dado faltante relevante identificado.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 3. ANÁLISE COMERCIAL */}
                        <div className="space-y-3">
                            <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200 p-4">
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Resumo
                                </p>
                                <p className="text-sm leading-relaxed text-slate-800 font-medium">
                                    {analise.resumo || 'Sem resumo disponível.'}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]" />
                                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                                        Próxima Ação
                                    </p>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-950 font-semibold">
                                    {analise.proxima_acao || 'Nenhuma próxima ação identificada.'}
                                </p>
                            </div>
                        </div>

                        {/* 4. MENSAGEM SUGERIDA */}
                        <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-[#040136]">
                                    Mensagem Sugerida
                                </h4>
                            </div>

                            <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line font-normal">
                                {analise.mensagem_sugerida || lead.mensagem_sugerida || 'Nenhuma mensagem personalizada disponível.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botão para mandar no WhatsApp (simulação) */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end shrink-0 bg-white">
                    <button
                        onClick={() => {
                            alert('Mensagem enviada com sucesso!')
                        }}
                        disabled={!analise.mensagem_sugerida && !lead.mensagem_sugerida}
                        className="bg-[#EE4C01] hover:bg-[#D84401] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        Enviar mensagem no WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
}
