import type { Lead } from '../services/leads'
import { formatarOrigem, formatarTexto, formatarIntencao } from '../utils/formatters'

type ModalLeadProps = {
    lead: Lead
    onClose: () => void
}

//Pega as informações da análise comercial da IA
function extrairAnalise(lead: Lead) {
    const dados = lead as Record<string, any>
    let resumo = dados.resumo || dados.analise_comercial?.resumo || null
    let proxima_acao = dados.proxima_acao || dados.analise_comercial?.proxima_acao || null
    let dados_faltantes: string[] = []

    if (Array.isArray(dados.dados_faltantes)) {
        dados_faltantes = dados.dados_faltantes.filter((i: any) => typeof i === 'string' && i.trim())
    } else if (Array.isArray(dados.analise_comercial?.dados_faltantes)) {
        dados_faltantes = dados.analise_comercial.dados_faltantes.filter((i: any) => typeof i === 'string' && i.trim())
    } else if (Array.isArray(dados.qualificacao?.dados_faltantes)) {
        dados_faltantes = dados.qualificacao.dados_faltantes.filter((i: any) => typeof i === 'string' && i.trim())
    }

    if (typeof dados.analise_comercial === 'string') {
        try {
            const parsed = JSON.parse(dados.analise_comercial)
            if (typeof parsed === 'object' && parsed !== null) {
                if (!resumo && parsed.resumo) resumo = parsed.resumo
                if (!proxima_acao && parsed.proxima_acao) proxima_acao = parsed.proxima_acao
                if (dados_faltantes.length === 0 && Array.isArray(parsed.dados_faltantes)) {
                    dados_faltantes = parsed.dados_faltantes.filter((i: any) => typeof i === 'string' && i.trim())
                }
            }
        } catch {
            if (!resumo) resumo = dados.analise_comercial
        }
    }

    return { resumo, proxima_acao, dados_faltantes }
}

export default function ModalLead({ lead, onClose }: ModalLeadProps) {
    const analise = extrairAnalise(lead)

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
                <div className="flex items-start justify-between p-6 border-b border-slate-200 shrink-0">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Detalhes do Lead
                        </p>

                        <h3 className="text-2xl font-black text-[#040136] mt-1">
                            {lead.nome}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {lead.telefone}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Conteúdo rolável */}
                <div className="overflow-y-auto flex-1">
                    {/* Informações do lead */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Origem
                            </p>
                            <p className="text-sm font-bold text-[#040136] mt-1">
                                {formatarOrigem(lead.origem)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Status
                            </p>
                            <p className="text-sm font-bold text-[#040136] mt-1">
                                {formatarTexto(lead.status)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Intenção
                            </p>
                            <p className="text-sm font-bold text-[#040136] mt-1">
                                {formatarIntencao(lead.intencao_compra)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Região
                            </p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                {formatarTexto(lead.regiao)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Tipo de imóvel
                            </p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                {formatarTexto(lead.tipo_imovel)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Faixa de valor
                            </p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                {formatarTexto(lead.faixa_valor)}
                            </p>
                        </div>
                    </div>

                    {/* Análise comercial da IA e Próxima ação (exibe se existirem) */}
                    {(analise.resumo || analise.proxima_acao || analise.dados_faltantes.length > 0) && (
                        <div className="px-6 pb-6 space-y-3">
                            {analise.resumo && (
                                <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                                        Análise comercial da IA
                                    </p>
                                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                                        {analise.resumo}
                                    </p>
                                </div>
                            )}

                            {analise.proxima_acao && (
                                <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]" />
                                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                                            Próxima ação recomendada
                                        </p>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-900 font-semibold">
                                        {analise.proxima_acao}
                                    </p>
                                </div>
                            )}

                            {analise.dados_faltantes.length > 0 && (
                                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                                        Dados a qualificar
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {analise.dados_faltantes.map((item, index) => (
                                            <span
                                                key={index}
                                                className="text-xs font-semibold bg-white text-slate-700 px-3 py-1 rounded-lg border border-slate-200"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mensagem personalizada da IA */}
                    <div className="px-6 pb-6">
                        <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />

                                <h4 className="text-xs font-black uppercase tracking-wider text-[#040136]">
                                    Mensagem personalizada
                                </h4>
                            </div>

                            <p className="text-sm leading-relaxed text-slate-700">
                                {lead.mensagem_sugerida ||
                                    'Nenhuma mensagem personalizada disponível.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botão para mandar no WhatsApp (simulação apenas) */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end shrink-0 bg-white">
                    <button
                        onClick={() => {
                            alert('Mensagem enviada com sucesso!')
                        }}
                        disabled={!lead.mensagem_sugerida}
                        className="bg-[#EE4C01] hover:bg-[#D84401] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        Mandar no WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
}