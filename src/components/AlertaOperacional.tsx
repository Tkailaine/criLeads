import { Link } from 'react-router-dom'

type AlertaOperacionalProps = {
    leadsAtencaoCount: number
}

//Alerta para leads que merecem atenção com link para a Central de Atenção
export default function AlertaOperacional({ leadsAtencaoCount }: AlertaOperacionalProps) {
    return (
        <section className="bg-[#040136] text-white py-8 md:py-10 border-b border-[#040136]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EE4C01]"></span>
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EE4C01]">
                            Atenção no Acompanhamento
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        {/* Exibe contagem de leads próximos do limite de 10 dias */}
                        {leadsAtencaoCount > 0
                            ? `${leadsAtencaoCount} ${leadsAtencaoCount === 1 ? 'lead próximo' : 'leads próximos'} do limite de 10 dias`
                            : 'Nenhum lead próximo do limite de 10 dias'}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 font-normal">
                        Leads sem contato entre 7 e 9 dias que exigem acompanhamento imediato antes de atingirem o limite de perda (10+ dias).
                    </p>
                </div>

                <div className="shrink-0">
                    {/* Botão com Link para navegar até a página de atenção */}
                    <Link
                        to="/atencao"
                        className="inline-block w-full sm:w-auto bg-[#EE4C01] hover:bg-[#D84401] text-white font-black text-xs md:text-sm px-7 py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg text-center"
                    >
                        Ver leads
                    </Link>
                </div>
            </div>
        </section>
    )
}
