import { useState } from 'react'

export default function FormularioLead() {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        origem: 'whatsapp',
        texto_interesse: ''
    })
    
    const [enviando, setEnviando] = useState(false)
    const [statusEnvio, setStatusEnvio] = useState<'idle' | 'sucesso' | 'erro'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.nome || !formData.telefone) return

        setEnviando(true)
        setStatusEnvio('idle')

        try {
            
            await fetch('URL_WEBHOOK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            
            
            // Simulação rápida de envio bem-sucedido
            setStatusEnvio('sucesso')
            setFormData({
                nome: '',
                telefone: '',
                origem: 'whatsapp',
                texto_interesse: ''
            })
        } catch (error) {
            console.error('Erro ao enviar webhook:', error)
            setStatusEnvio('erro')
        } finally {
            setEnviando(false)
        }
    }

    return (
                <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Nome */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                Nome *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Carlos Eduardo"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EE4C01]"
                            />
                        </div>

                        {/* Telefone */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                Telefone / WhatsApp *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: (47) 99123-4567"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                className="w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EE4C01]"
                            />
                        </div>

                        {/* Origem */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                Origem do Lead
                            </label>
                            <select
                                value={formData.origem}
                                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                                className="w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EE4C01] cursor-pointer"
                            >
                                <option value="whatsapp">WhatsApp</option>
                                <option value="portal">Portal Imobiliário</option>
                                <option value="instagram">Instagram</option>
                                <option value="indicacao">Indicação</option>
                                <option value="site">Site Institucional</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    {/* Mensagem / Interesse */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                            Mensagem / Interesse do Lead
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ex: Interesse em cobertura frente mar em Itapema, orçamento aprox. R$ 4 mi..."
                            value={formData.texto_interesse}
                            onChange={(e) => setFormData({ ...formData, texto_interesse: e.target.value })}
                            className="w-full bg-white text-[#040136] font-semibold text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#EE4C01] resize-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                        {statusEnvio === 'sucesso' && (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                                ✓ Lead enviado com sucesso!
                            </span>
                        )}
                        {statusEnvio === 'erro' && (
                            <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-500/30">
                                ✕ Erro ao enviar. Verifique e tente novamente.
                            </span>
                        )}
                        {statusEnvio === 'idle' && <span></span>}

                        <button
                            type="submit"
                            disabled={enviando}
                            className="bg-[#EE4C01] hover:bg-[#D84401] disabled:opacity-50 text-white font-black text-xs md:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg w-full sm:w-auto text-center"
                        >
                            {enviando ? 'Enviando...' : 'Enviar lead'}
                        </button>
                    </div>
                </form>
    )
}
