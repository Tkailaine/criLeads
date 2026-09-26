//Rodapé institucional
export default function Footer() {
    return (
        <footer className="bg-[#040136] text-white border-t border-[#040136] py-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                    <img src="/logo-cri.png" alt="CRI" className="h-6 w-auto" />
                    <span className="text-slate-300 font-medium">
                        CRI Soluções Imobiliárias — Sistema Interno de Gestão de Leads
                    </span>
                </div>
                <div>
                    Santa Catarina, SC • Brasil
                </div>
            </div>
        </footer>
    )
}
