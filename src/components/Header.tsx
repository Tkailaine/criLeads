import { Link, useLocation } from 'react-router-dom'
//Header fixo para futuras navegações
export default function Header() {
    const location = useLocation()

    return (
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo-cri.png"
                            alt="CRI Soluções Imobiliárias"
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-[#040136] tracking-tight">
                            Visão geral dos leads
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 font-normal">
                            Gestão e acompanhamento da carteira de oportunidades.
                        </p>
                    </div>
                </div>

                {/* Navegação / Badges */}
                <div className="flex items-center gap-3">
                    <nav className="flex items-center gap-2">
                        <Link
                            to="/"
                            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                location.pathname === '/'
                                    ? 'bg-[#040136] text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Dashboard
                        </Link>
                    </nav>

                    <div className="hidden lg:flex text-xs font-semibold text-slate-600 bg-[#F4F5F8] px-4 py-2 rounded-xl border border-slate-200/70">
                        CRI Soluções Imobiliárias • Santa Catarina
                    </div>
                </div>
            </div>
        </header>
    )
}
