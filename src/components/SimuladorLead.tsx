import { useState } from 'react'

//Tipagem das propriedades do formulário de simulação
type FormularioLeadProps = {
    onLeadCriado?: () => Promise<void> | void
}

//Componente de simulação para cadastro e envio de novos leads
export default function FormularioLead({ onLeadCriado }: FormularioLeadProps = {}) {
    //Estados para armazenar os campos do formulário
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        origem: 'whatsapp',
        texto_interesse: ''
    })

    //Estados para controlar erros de validação, carregamento e status do envio
    const [erros, setErros] = useState<{ nome?: string; telefone?: string; texto_interesse?: string }>({})
    const [enviando, setEnviando] = useState(false)
    const [statusEnvio, setStatusEnvio] = useState<'idle' | 'sucesso' | 'erro'>('idle')

    //Formata o telefone automaticamente com máscara enquanto o usuário digita
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

    //Atualiza o telefone e remove o erro ao digitar
    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatado = formatarMascaraTelefone(e.target.value)
        setFormData({ ...formData, telefone: formatado })
        if (erros.telefone) setErros((prev) => ({ ...prev, telefone: undefined }))
    }

    //Atualiza o nome e limpa a mensagem de erro
    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, nome: e.target.value })
        if (erros.nome) setErros((prev) => ({ ...prev, nome: undefined }))
    }

    //Atualiza o texto de interesse e limpa o erro
    const handleTextoInteresseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, texto_interesse: e.target.value })
        if (erros.texto_interesse) setErros((prev) => ({ ...prev, texto_interesse: undefined }))
    }

    //Valida os campos obrigatórios antes do envio
    const validarFormulario = () => {
        const novosErros: { nome?: string; telefone?: string; texto_interesse?: string } = {}
        const digitosTelefone = formData.telefone.replace(/\D/g, '')

        //Verifica se o nome tem pelo menos 3 caracteres
        if (!formData.nome.trim() || formData.nome.trim().length < 3) {
            novosErros.nome = 'Informe um nome válido (mínimo 3 caracteres).'
        }

        //Verifica se o telefone tem DDD e formato válido
        if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
            novosErros.telefone = 'Informe um telefone/WhatsApp válido com DDD (10 ou 11 dígitos).'
        }

        //Verifica se o interesse foi preenchido
        if (!formData.texto_interesse.trim() || formData.texto_interesse.trim().length < 5) {
            novosErros.texto_interesse = 'Informe a mensagem ou interesse do lead (mínimo 5 caracteres).'
        }

        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    //Dispara o envio do lead para o webhook
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validarFormulario()) return

        //Gera a chave de idempotência para evitar duplicidade de registro
        const chave_idempotencia = crypto.randomUUID()

        setEnviando(true)
        setStatusEnvio('idle')

        //Busca a URL do webhook nas variáveis de ambiente
        const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL

        try {
            //Envia os dados do lead em formato JSON via POST
            const resposta = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    chave_idempotencia
                })
            })

            //Valida se a requisição retornou status 2xx
            if (!resposta.ok) {
                throw new Error(`Erro na resposta do webhook: status ${resposta.status}`)
            }

            //Indica sucesso e reseta os campos do formulário
            setStatusEnvio('sucesso')
            setFormData({
                nome: '',
                telefone: '',
                origem: 'whatsapp',
                texto_interesse: ''
            })
            setErros({})

            //Atualiza os dados do dashboard sem recarregar a página
            if (onLeadCriado) {
                await onLeadCriado()
            }
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
                {/* Campo de Nome */}
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

                {/* Campo de Telefone */}
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

                {/* Seleção da Origem */}
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
                        <option value="indicacao">Indicação</option>
                        <option value="site">Site Institucional</option>
                    </select>
                </div>
            </div>

            {/* Mensagem / Interesse do Lead */}
            <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mensagem / Interesse do Lead *
                </label>
                <textarea
                    rows={3}
                    placeholder="Ex: Interesse em cobertura frente mar em Itapema, orçamento aprox. R$ 4 mi..."
                    value={formData.texto_interesse}
                    onChange={handleTextoInteresseChange}
                    className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 resize-none ${
                        erros.texto_interesse 
                            ? 'border-2 border-rose-500 focus:ring-rose-500' 
                            : 'focus:ring-[#EE4C01]'
                    }`}
                ></textarea>
                {erros.texto_interesse && (
                    <p className="text-[11px] font-bold text-rose-400 mt-1">{erros.texto_interesse}</p>
                )}
            </div>

            {/* Ações e status do envio */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                {/* Mensagem de sucesso */}
                {statusEnvio === 'sucesso' && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                        ✓ Lead enviado com sucesso!
                    </span>
                )}
                {/* Mensagem de erro */}
                {statusEnvio === 'erro' && (
                    <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-500/30">
                        ✕ Erro ao enviar. Verifique e tente novamente.
                    </span>
                )}
                {statusEnvio === 'idle' && <span></span>}

                {/* Botão para submeter o formulário */}
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
