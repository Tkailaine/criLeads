import type { Lead } from '../services/leads'

type IndicadoresProps = {
    leads: Lead[]
}

export default function Indicadores({ leads }: IndicadoresProps) {
    const total = leads.length
    const novos = leads.filter((lead) => lead.status === 'novo').length
    const emContato = leads.filter((lead) => lead.status === 'em_contato').length
    const qualificados = leads.filter((lead) => lead.status === 'qualificado').length
    const perdidos = leads.filter((lead) => lead.status === 'perdido').length

    const taxaConversao = total > 0 ? Math.round((qualificados / total) * 100) : 0

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#040136] tracking-tight">
                        Indicadores
                    </h2>
                    <p className="text-sm text-slate-500 font-normal mt-0.5">
                        Resumo dos leads cadastrados e status atual de atendimento.
                    </p>
                </div>
                <div className="text-xs font-bold text-[#040136] bg-[#F4F5F8] px-4 py-2 rounded-xl border border-slate-200/70 self-start sm:self-auto">
                    Taxa de Conversão: <span className="text-[#EE4C01] font-black text-sm ml-1">{taxaConversao}%</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
                {/* Total */}
                <div className="pt-3 md:pt-0 md:pr-6 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Total de Leads
                    </span>
                    <div>
                        <span className="text-4xl md:text-5xl font-black text-[#040136] tracking-tight block">
                            {total}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        Leads na carteira
                    </span>
                </div>

                {/* Novos */}
                <div className="pt-3 md:pt-0 md:px-6 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#EE4C01]">
                        Novos
                    </span>
                    <div>
                        <span className="text-4xl md:text-5xl font-black text-[#EE4C01] tracking-tight block">
                            {novos}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        Entrada recente
                    </span>
                </div>

                {/* Em Contato */}
                <div className="pt-3 md:pt-0 md:px-6 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2201B2]">
                        Em Contato
                    </span>
                    <div>
                        <span className="text-4xl md:text-5xl font-black text-[#040136] tracking-tight block">
                            {emContato}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        Em atendimento
                    </span>
                </div>

                {/* Qualificados */}
                <div className="pt-3 md:pt-0 md:px-6 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        Qualificados
                    </span>
                    <div>
                        <span className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tight block">
                            {qualificados}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        Perfil aprovado
                    </span>
                </div>

                {/* Perdidos */}
                <div className="pt-3 md:pt-0 md:pl-6 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Perdidos
                    </span>
                    <div>
                        <span className="text-4xl md:text-5xl font-black text-slate-400 tracking-tight block">
                            {perdidos}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        Sem continuidade
                    </span>
                </div>
            </div>
        </div>
    )
}