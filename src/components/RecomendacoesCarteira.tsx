import {
    type LeadsPorOrigem,
    type QualificacaoPorOrigem
} from '../services/relatorios'
import { formatarOrigem, formatarPercentual, formatarRegiao, formatarTexto, formatarFaixaValor } from '../utils/formatters'
import type { Lead } from '../services/leads'

//Tipagem de props dos indicadores operacionais
type InsightsOperacionaisProps = {
    leads: Lead[]
    leadsAtencaoCount: number
    leadsPorOrigem?: LeadsPorOrigem[]
    qualificacaoPorOrigem: QualificacaoPorOrigem[]
}

//Esse componente mostra padrões dos dados que podem ajudar na decisão comercial
export default function InsightsOperacionais({
    leads,
    leadsAtencaoCount,
    qualificacaoPorOrigem
}: InsightsOperacionaisProps) {

    //Encontra o canal com maior taxa de qualificação
    const maiorTaxaQualificacao = [...qualificacaoPorOrigem]
        .sort((a, b) => b.percentual_qualificados - a.percentual_qualificados)[0]

    //Encontra a combinação de região e tipo de imóvel mais recorrente
    const combinacoesImoveis = leads.reduce<Record<string, number>>((acc, lead) => {
        if (!lead.regiao || !lead.tipo_imovel) return acc

        const combinacao = `${formatarRegiao(lead.regiao)} · ${formatarTexto(lead.tipo_imovel)}`

        acc[combinacao] = (acc[combinacao] || 0) + 1

        return acc
    }, {})

    const maiorCombinacaoImovel = Object.entries(combinacoesImoveis)
        .sort((a, b) => b[1] - a[1])[0]

    //Encontra a faixa de valor mais recorrente
    const faixasValor = leads.reduce<Record<string, number>>((acc, lead) => {
        if (!lead.faixa_valor) return acc

        const faixa = lead.faixa_valor.trim()

        if (faixa === '-') return acc

        acc[faixa] = (acc[faixa] || 0) + 1

        return acc
    }, {})

    const maiorFaixaValor = Object.entries(faixasValor)
        .sort((a, b) => b[1] - a[1])[0]

    //Monta as recomendações com base nos dados atuais da carteira
    const recomendacoes = []

    if (maiorTaxaQualificacao) {
        recomendacoes.push({
            tipo: 'CANAL COM MAIOR CONVERSÃO',
            titulo: `${formatarOrigem(maiorTaxaQualificacao.origem)} apresenta ${formatarPercentual(maiorTaxaQualificacao.percentual_qualificados)} de qualificação.`,
            descricao: `${maiorTaxaQualificacao.total_qualificados} de ${maiorTaxaQualificacao.total_leads} leads desse canal foram qualificados.`,
            acao: 'Priorizar o acompanhamento dos leads desse canal e comparar o custo por lead qualificado antes de ampliar o investimento.'
        })
    }

    if (maiorCombinacaoImovel) {
        recomendacoes.push({
            tipo: 'PERFIL MAIS RECORRENTE',
            titulo: `${maiorCombinacaoImovel[0]} concentra ${maiorCombinacaoImovel[1]} leads da carteira.`,
            descricao: maiorFaixaValor
                ? `A faixa de valor mais recorrente atualmente é ${formatarFaixaValor(maiorFaixaValor[0])}, com ${maiorFaixaValor[1]} leads.`
                : 'Esse perfil aparece com maior frequência entre os leads cadastrados.',
            acao: 'Usar esse perfil como referência para priorizar oportunidades, campanhas e abordagem comercial.'
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#040136]">
                        Recomendações da Carteira
                    </h4>
                </div>

                <p className="text-sm text-slate-500">
                    Padrões identificados nos dados para apoiar decisões comerciais.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {recomendacoes.map((recomendacao, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50/40 p-5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    index === 0
                                        ? 'bg-[#2201B2]'
                                        : 'bg-[#EE4C01]'
                                }`}
                            />

                            <span className="text-[10px] font-black uppercase tracking-wider text-[#2201B2]">
                                {recomendacao.tipo}
                            </span>
                        </div>

                        <h5 className="text-sm md:text-base font-bold text-[#040136] leading-relaxed mb-2">
                            {recomendacao.titulo}
                        </h5>

                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-5">
                            {recomendacao.descricao}
                        </p>

                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs font-bold text-[#040136] mb-1">
                                → Ação recomendada:
                            </p>

                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                {recomendacao.acao}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            {leadsAtencaoCount > 0 && (
                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50/50 px-5 py-4">
                    <p className="text-xs md:text-sm text-slate-700">
                        <strong className="text-[#EE4C01]">
                            Atenção operacional:
                        </strong>{' '}
                        {leadsAtencaoCount} leads estão próximos do limite de 10 dias sem contato.
                        Priorize esses contatos antes de ampliar a prospecção.
                    </p>
                </div>
            )}

        </div>
    )
}