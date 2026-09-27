import type { Lead } from '../services/leads'
import type { QualificacaoPorOrigem } from '../services/relatorios'
import { formatarOrigem } from '../utils/formatters'

type RecomendacoesCarteiraProps = {
    leads: Lead[]
    qualificacaoPorOrigem: QualificacaoPorOrigem[]
}

type GrupoPerfil = {
    regiao: string
    tipo_imovel: string
    faixa_valor: string
    total: number
    altaIntencao: number
    qualificados: number
}

export default function RecomendacoesCarteira({
    leads,
    qualificacaoPorOrigem
}: RecomendacoesCarteiraProps) {

    // Agrupa os leads por região + tipo de imóvel + faixa de valor
    const grupos = new Map<string, GrupoPerfil>()

    leads.forEach((lead) => {
        if (!lead.regiao || !lead.tipo_imovel || !lead.faixa_valor) return

        const chave = [
            lead.regiao.trim().toLowerCase(),
            lead.tipo_imovel.trim().toLowerCase(),
            lead.faixa_valor.trim().toLowerCase()
        ].join('|')

        const grupo = grupos.get(chave)

        if (grupo) {
            grupo.total += 1

            if (lead.intencao_compra?.toLowerCase() === 'alta') {
                grupo.altaIntencao += 1
            }

            if (lead.status?.toLowerCase() === 'qualificado') {
                grupo.qualificados += 1
            }
        } else {
            grupos.set(chave, {
                regiao: lead.regiao,
                tipo_imovel: lead.tipo_imovel,
                faixa_valor: lead.faixa_valor,
                total: 1,
                altaIntencao:
                    lead.intencao_compra?.toLowerCase() === 'alta' ? 1 : 0,
                qualificados:
                    lead.status?.toLowerCase() === 'qualificado' ? 1 : 0
            })
        }
    })

    // Considera apenas padrões com pelo menos 2 leads
    const gruposRelevantes = [...grupos.values()]
        .filter(grupo => grupo.total >= 2)
        .sort((a, b) => {
            const pontuacaoA = a.altaIntencao + a.qualificados
            const pontuacaoB = b.altaIntencao + b.qualificados

            return pontuacaoB - pontuacaoA
        })

    const principal = gruposRelevantes[0]

    // Encontra a origem com maior taxa de qualificação
    const origemPrincipal = [...qualificacaoPorOrigem]
        .filter(item => Number(item.total_leads) >= 2)
        .sort(
            (a, b) =>
                Number(b.percentual_qualificados) -
                Number(a.percentual_qualificados)
        )[0]

    if (!principal && !origemPrincipal) {
        return null
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">

            <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Recomendações da Carteira
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                    Padrões identificados nos dados para apoiar decisões comerciais.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {principal && (
                    <div className="border border-slate-200 rounded-xl p-5">

                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />

                            <span className="text-[11px] font-black uppercase tracking-wider text-[#EE4C01]">
                                Prioridade Comercial
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-[#040136] leading-relaxed">
                            {principal.tipo_imovel} em {principal.regiao}, na faixa de{' '}
                            {principal.faixa_valor}, concentra oportunidades relevantes
                            na carteira atual.
                        </p>

                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                            {principal.altaIntencao} de {principal.total} leads possuem
                            alta intenção de compra e {principal.qualificados} estão
                            qualificados.
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-semibold text-[#040136]">
                                → Ação recomendada:
                            </p>

                            <p className="text-xs text-slate-600 mt-1">
                                Priorizar esses leads no atendimento e direcionar primeiro
                                os imóveis desse perfil.
                            </p>
                        </div>
                    </div>
                )}

                {origemPrincipal && (
                    <div className="border border-slate-200 rounded-xl p-5">

                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#2201B2]" />

                            <span className="text-[11px] font-black uppercase tracking-wider text-[#2201B2]">
                                Oportunidade de Aquisição
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-[#040136] leading-relaxed">
                            {formatarOrigem(origemPrincipal.origem)} apresenta{' '}
                            {Number(origemPrincipal.percentual_qualificados)
                                .toLocaleString('pt-BR', {
                                    maximumFractionDigits: 1
                                })}% de qualificação na carteira atual.
                        </p>

                        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                            São {origemPrincipal.total_qualificados} leads qualificados
                            em um total de {origemPrincipal.total_leads} recebidos pelo
                            canal.
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-semibold text-[#040136]">
                                → Ação recomendada:
                            </p>

                            <p className="text-xs text-slate-600 mt-1">
                                Acompanhar o desempenho do canal e comparar o custo por
                                lead qualificado antes de ampliar investimentos.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}