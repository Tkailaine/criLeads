//Tipagem de props dos indicadores operacionais
type InsightsOperacionaisProps = {
    leadsAtencaoCount: number;
}
//Esse componente irá mostrar os insights conforme os leads são cadastrados
export default function InsightsOperacionais({ leadsAtencaoCount }: InsightsOperacionaisProps) {
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
                        <strong className="text-[#040136]">MOCK</strong> tem a maior taxa de qualificação: <strong>MOCK</strong>.
                    </p>
                </div>
                {/*Informa qual canal tem o maior volume de leads */}
                <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2201B2] shrink-0 mt-1.5"></span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        <strong className="text-[#040136]">MOCK</strong> concentra o maior volume de novos contatos.
                    </p>
                </div>
                {/*Em breve os leads que estão perto de 10 dias sem contato*/}
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
