import { type LeadsPorOrigem, type QualificacaoPorOrigem } from '../services/relatorios'
import { formatarOrigem, formatarPercentual } from '../utils/formatters'

//Tipagem de props dos indicadores operacionais
type InsightsOperacionaisProps = {
    leadsAtencaoCount: number;
    leadsPorOrigem: LeadsPorOrigem[]
    qualificacaoPorOrigem: QualificacaoPorOrigem[]
}

//Esse componente irá mostrar os insights conforme os leads são cadastrados
export default function InsightsOperacionais({ leadsAtencaoCount, leadsPorOrigem, qualificacaoPorOrigem }: InsightsOperacionaisProps) {
    //Encontra a maior taxa de qualificação
    const maiorTaxaQualificacao = [...qualificacaoPorOrigem]
        .sort((a, b) => b.percentual_qualificados - a.percentual_qualificados)[0]
    //Encontra o maior volume de leads
    const maiorVolumeOrigem = [...leadsPorOrigem]
        .sort((a, b) => b.total_leads - a.total_leads)[0]
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                Insights da Carteira
            </h4>
            {/*Informa qual canal tem maior sucesso em qualificação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm">
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        <strong className="text-[#040136]">
                            {maiorTaxaQualificacao
                                ? formatarOrigem(maiorTaxaQualificacao.origem)
                                : '-'}
                        </strong>{' '}
                        tem a maior taxa de qualificação:{' '}
                        <strong>
                            {maiorTaxaQualificacao
                                ? formatarPercentual(maiorTaxaQualificacao.percentual_qualificados)
                                : '-'}
                        </strong>.
                    </p>
                </div>
                {/*Informa qual canal tem o maior volume de leads */}
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2201B2] shrink-0 mt-1.5"></span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        <strong className="text-[#040136]">
                            {maiorVolumeOrigem
                                ? formatarOrigem(maiorVolumeOrigem.origem)
                                : '-'}
                        </strong>{' '}
                        concentra o maior volume de novos contatos.
                    </p>
                </div>
                {/*Leads que estão perto de 10 dias sem contato*/}
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#EE4C01] shrink-0 mt-1.5"></span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        <strong className="text-[#040136]">{leadsAtencaoCount} leads</strong> exigem contato imediato para evitar perda de negócio.
                    </p>
                </div>
            </div>
        </div>
    )
}
