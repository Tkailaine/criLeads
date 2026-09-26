//Tipagem das propriedades do cabeçalho de atenção
type HeroAtencaoProps = {
    totalAtencao: number
}


export default function HeroAtencao({ totalAtencao }: HeroAtencaoProps) {
    return (
        <section className="bg-[#040136] text-white py-10 md:py-12 border-b border-[#040136]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EE4C01]"></span>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EE4C01]">
                        Acompanhamento Crítico
                    </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            Leads que precisam de contato
                        </h2>
                        <p className="text-xs md:text-sm text-slate-300 font-normal mt-1">
                            Monitore oportunidades prestes a esfriar para evitar perda de negócios.
                        </p>
                    </div>

                    {/* Contador de leads em atenção */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 border border-white/15 px-5 py-2.5 rounded-xl text-center">
                            <span className="block text-xs font-bold text-[#EE4C01]">Em Atenção</span>
                            <strong className="text-xl font-black text-white">{totalAtencao}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
