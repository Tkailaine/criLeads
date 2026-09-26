import type { LeadsPorOrigem } from '../services/relatorios'
import { formatarOrigem } from '../utils/formatters'

//Tipagem do componente
type LeadsPorOrigemCardProps = {
    dados: LeadsPorOrigem[];
    totalLeads?: number;
}

//Recebe os dados de leads por origem e renderiza o gráfico de barras
export default function LeadsPorOrigemCard({ dados, totalLeads = 0 }: LeadsPorOrigemCardProps) {
    //Verifica se tem total de leads para calcular a porcentagem
    const total = totalLeads > 0 
        ? totalLeads 
        : dados.reduce((acc, item) => acc + Number(item.total_leads || 0), 0)

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6 shadow-xs">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-xl font-black text-[#040136] tracking-tight">
                        Leads por origem
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        De onde vêm os leads cadastrados
                    </p>
                </div>
                {/*Exibe o total de leads*/}
                <span className="text-xs font-bold text-[#040136] bg-[#F4F5F8] px-3.5 py-1 rounded-lg">
                    Total: {total}
                </span>
            </div>

            <div className="space-y-5 pt-1">
                {dados.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum dado disponível</p>
                ) : (//Renderiza os dados de leads por origem
                    dados.map((item, idx) => {
                        const percent = total > 0
                            ? Math.round((Number(item.total_leads) / total) * 100)
                            : 0

                        const isWhatsapp = item.origem.toLowerCase().includes('whatsapp')
                        const barColor = isWhatsapp ? 'bg-emerald-600' : idx % 2 === 0 ? 'bg-[#040136]' : 'bg-[#EE4C01]'

                        return (
                            <div key={item.origem || idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-black text-[#040136] tracking-wide">
                                        {formatarOrigem(item.origem, true)}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-black text-[#040136]">{item.total_leads} leads</span>
                                        <span className="text-xs text-slate-400 font-semibold">({percent}%)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-[#F4F5F8] rounded-lg h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-lg ${barColor} transition-all duration-500`}
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
