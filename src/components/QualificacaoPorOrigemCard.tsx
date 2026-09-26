import type { QualificacaoPorOrigem } from '../services/relatorios'
import { formatarOrigem, formatarPercentual } from '../utils/formatters'

//Props do gráfico de qualificação por origem
type QualificacaoPorOrigemCardProps = {
    dados: QualificacaoPorOrigem[];
}

//Gráfico de qualificação por origem
export default function QualificacaoPorOrigemCard({ dados }: QualificacaoPorOrigemCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 shadow-xs">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-xl font-black text-[#040136] tracking-tight">
                        Qualificação por origem
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Percentual de leads qualificados por canal
                    </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                    Taxa de Qualificação
                </span>
            </div>

            <div className="space-y-5 pt-1">
                {/*Verifica se tem dados*/}
                {dados.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum dado disponível</p>
                ) : (
                    //Renderiza o percentual de cada canal
                    dados.map((item, idx) => {
                        const percent = Number(item.percentual_qualificados) || 0

                        return (
                            <div key={item.origem || idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-black text-[#040136] tracking-wide">
                                        {formatarOrigem(item.origem, true)}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs text-slate-500 font-semibold">
                                            {item.total_qualificados} de {item.total_leads}
                                        </span>
                                        <span className="font-black text-emerald-600 text-sm">
                                            {formatarPercentual(percent)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-[#F4F5F8] rounded-lg h-2.5 overflow-hidden">
                                    <div
                                        className="h-2.5 rounded-lg bg-emerald-600 transition-all duration-500"
                                        style={{ width: `${Math.max(percent, 6)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
