import type { Lead } from '../services/leads'
import { formatarOrigem, formatarTexto, formatarIntencao } from '../utils/formatters'

type ModalLeadProps = {
    lead: Lead
    onClose: () => void
}

export default function ModalLead({ lead, onClose }: ModalLeadProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#040136]/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Detalhes do Lead
                        </p>

                        <h3 className="text-2xl font-black text-[#040136] mt-1">
                            {lead.nome}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {lead.telefone}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Informações do lead */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Origem
                        </p>
                        <p className="text-sm font-bold text-[#040136] mt-1">
                            {formatarOrigem(lead.origem)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Status
                        </p>
                        <p className="text-sm font-bold text-[#040136] mt-1">
                            {formatarTexto(lead.status)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Intenção
                        </p>
                        <p className="text-sm font-bold text-[#040136] mt-1">
                            {formatarIntencao(lead.intencao_compra)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Região
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                            {formatarTexto(lead.regiao)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Tipo de imóvel
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                            {formatarTexto(lead.tipo_imovel)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                            Faixa de valor
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                            {formatarTexto(lead.faixa_valor)}
                        </p>
                    </div>
                </div>

                {/* Mensagem personalizada da IA */}
                <div className="px-6 pb-6">
                    <div className="rounded-2xl bg-[#F8F9FB] border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />

                            <h4 className="text-xs font-black uppercase tracking-wider text-[#040136]">
                                Mensagem personalizada
                            </h4>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-700">
                            {lead.mensagem_sugerida ||
                                'Nenhuma mensagem personalizada disponível.'}
                        </p>
                    </div>
                </div>

                {/* Botão para mandar no WhatsApp (simulação apenas) */}
                <div className="px-6 pb-6 flex justify-end">
                    <button
                        onClick={() => {
                            alert('Mensagem enviada com sucesso!')
                        }}
                        disabled={!lead.mensagem_sugerida}
                        className="bg-[#EE4C01] hover:bg-[#D84401] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                        Mandar no WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
}