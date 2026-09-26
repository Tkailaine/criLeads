import { useState } from 'react'

export default function FormularioLead() {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        origem: 'whatsapp',
        texto_interesse: ''
    })

    const [erros, setErros] = useState<{ nome?: string; telefone?: string }>({})
    const [enviando, setEnviando] = useState(false)
    const [statusEnvio, setStatusEnvio] = useState<'idle' | 'sucesso' | 'erro'>('idle')

    // Formata o telefone automaticamente enquanto digita (apenas números)
    const formatarMascaraTelefone = (valor: string) => {
        const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11)
        
        if (apenasDigitos.length <= 2) {
            return apenasDigitos.length > 0 ? `(${apenasDigitos}` : ''
        }
        if (apenasDigitos.length <= 6) {
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`
        }
        if (apenasDigitos.length <= 10) {
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`
        }
        return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7, 11)}`
    }

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatado = formatarMascaraTelefone(e.target.value)
        setFormData({ ...formData, telefone: formatado })
        if (erros.telefone) setErros({ ...erros, telefone: undefined })
    }

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, nome: e.target.value })
        if (erros.nome) setErros({ ...erros, nome: undefined })
    }

    const validarFormulario = () => {
        const novosErros: { nome?: string; telefone?: string } = {}
        const digitosTelefone = formData.telefone.replace(/\D/g, '')

        if (!formData.nome.trim() || formData.nome.trim().length < 3) {
            novosErros.nome = 'Informe um nome válido (mínimo 3 caracteres).'
        }

        if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
            novosErros.telefone = 'Informe um telefone/WhatsApp válido com DDD (10 ou 11 dígitos).'
        }

        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validarFormulario()) return

        const chave_idempotencia = crypto.randomUUID()

        setEnviando(true)
        setStatusEnvio('idle')

        try {
            await fetch('https://n8n.automacoesjuridicas.com.br/webhook-test/entrada-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    chave_idempotencia
                })
            })

            setStatusEnvio('sucesso')
            setFormData({
                nome: '',
                telefone: '',
                origem: 'whatsapp',
                texto_interesse: ''
            })
            setErros({})
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
                        placeholder="Ex: Carlos Eduardo"
                        value={formData.nome}
                        onChange={handleNomeChange}
                        className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                            erros.nome 
                                ? 'border-2 border-rose-500 focus:ring-rose-500' 
                                : 'focus:ring-[#EE4C01]'
                        }`}
                    />
                    {erros.nome && (
                        <p className="text-[11px] font-bold text-rose-400 mt-1">{erros.nome}</p>
                    )}
                </div>

                {/* Telefone */}
                <div className="space-y-1.5 md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Telefone / WhatsApp *
                    </label>
                    <input
                        type="tel"
                        placeholder="Ex: (47) 99123-4567"
                        value={formData.telefone}
                        onChange={handleTelefoneChange}
                        maxLength={15}
                        className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                            erros.telefone 
                                ? 'border-2 border-rose-500 focus:ring-rose-500' 
                                : 'focus:ring-[#EE4C01]'
                        }`}
                    />
                    {erros.telefone && (
                        <p className="text-[11px] font-bold text-rose-400 mt-1">{erros.telefone}</p>
                    )}
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
