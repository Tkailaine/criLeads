import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../services/leads'
import { extrairDadosIA, formatarIntencao, formatarOrigem, formatarTexto } from '../utils/formatters'

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

    //Estados para controlar erros de validação, carregamento, status do envio e o lead retornado/salvo
    const [erros, setErros] = useState<{ nome?: string; telefone?: string; texto_interesse?: string }>({})
    const [enviando, setEnviando] = useState(false)
    const [statusEnvio, setStatusEnvio] = useState<'idle' | 'sucesso' | 'erro'>('idle')
    const [leadProcessado, setLeadProcessado] = useState<Lead | null>(null)

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

    //Dispara o envio do lead para o webhook e aguarda ativamente a IA processar e salvar no banco
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validarFormulario()) return

        //Gera a chave de idempotência e registra o momento exato do envio
        const chave_idempotencia = crypto.randomUUID()
        const momentoEnvio = new Date(Date.now() - 3000).toISOString()
        const nomeEnviado = formData.nome.trim()
        const telefoneEnviado = formData.telefone.trim()

        setEnviando(true)
        setStatusEnvio('idle')
        setLeadProcessado(null)

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

            //Tenta extrair o lead diretamente da resposta caso o webhook retorne o JSON completo
            let leadRetornado: Lead | null = null
            try {
                const jsonResp = await resposta.json()
                if (jsonResp && typeof jsonResp === 'object' && (jsonResp.id || jsonResp.resumo || jsonResp.intencao_compra)) {
                    leadRetornado = jsonResp as Lead
                }
            } catch {
                //Resposta não continha JSON do lead, segue para o polling no Supabase
            }

            //Função de espera assíncrona (polling) que aguarda a IA do n8n gravar o novo lead no Supabase
            if (!leadRetornado) {
                const maxTentativas = 12 // Até ~15 segundos de tentativas
                const intervaloMs = 1200

                for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
                    //1. Tenta buscar pelo registro exato com a chave de idempotência
                    const { data: leadPorChave } = await supabase
                        .from('leads')
                        .select('*')
                        .eq('chave_idempotencia', chave_idempotencia)
                        .maybeSingle()

                    if (leadPorChave) {
                        leadRetornado = leadPorChave as Lead
                        break
                    }

                    //2. Tenta buscar pelo telefone ou nome criados a partir do momento do envio
                    const { data: leadRecente } = await supabase
                        .from('leads')
                        .select('*')
                        .gte('created_at', momentoEnvio)
                        .or(`nome.eq."${nomeEnviado}",telefone.eq."${telefoneEnviado}"`)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle()

                    if (leadRecente) {
                        leadRetornado = leadRecente as Lead
                        break
                    }

                    //Aguarda antes da próxima tentativa
                    if (tentativa < maxTentativas) {
                        await new Promise((resolve) => setTimeout(resolve, intervaloMs))
                    }
                }
            }

            //Se encontrou o novo lead gravado pela IA, atualiza o estado
            if (leadRetornado) {
                setLeadProcessado(leadRetornado)
            }

            //Atualiza todos os dados do dashboard (leads, gráficos, indicadores) agora que o novo lead está no banco
            if (onLeadCriado) {
                await onLeadCriado()
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
        } catch (error) {
            console.error('Erro ao processar envio do lead:', error)
            setStatusEnvio('erro')
        } finally {
            setEnviando(false)
        }
    }

    //Renderiza o badge visual para a intenção de compra
    const renderIntencaoBadge = (intencao?: string | null) => {
        if (!intencao) return <span className="text-xs text-slate-400 font-medium">-</span>
        const chave = intencao.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        switch (chave) {
            case 'alta':
                return (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#EE4C01] bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            case 'media':
                return (
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#2201B2] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2201B2]"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            case 'pesquisando':
                return (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {formatarIntencao(intencao)}
                    </span>
                )
        }
    }

    const analiseLead = leadProcessado ? extrairDadosIA(leadProcessado) : null

    return (
        <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                            disabled={enviando}
                            className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-60 ${
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
                            disabled={enviando}
                            className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-60 ${
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
                            disabled={enviando}
                            className="w-full bg-white text-[#040136] font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EE4C01] cursor-pointer disabled:opacity-60"
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
                        disabled={enviando}
                        className={`w-full bg-white text-[#040136] font-semibold text-sm rounded-xl p-3.5 focus:outline-none focus:ring-2 resize-none disabled:opacity-60 ${
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
                    {/* Status enquanto está enviando/processando */}
                    {enviando && (
                        <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#EE4C01] animate-ping" />
                            A IA está qualificando o lead e atualizando os dados...
                        </span>
                    )}

                    {/* Mensagem de sucesso */}
                    {!enviando && statusEnvio === 'sucesso' && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                            ✓ Lead processado e cadastrado com sucesso!
                        </span>
                    )}

                    {/* Mensagem de erro */}
                    {!enviando && statusEnvio === 'erro' && (
                        <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-500/30">
                            ✕ Erro ao processar. Verifique e tente novamente.
                        </span>
                    )}

                    {!enviando && statusEnvio === 'idle' && <span></span>}

                    {/* Botão para submeter o formulário */}
                    <button
                        type="submit"
                        disabled={enviando}
                        className="bg-[#EE4C01] hover:bg-[#D84401] disabled:opacity-60 text-white font-black text-xs md:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg w-full sm:w-auto text-center flex items-center justify-center gap-2"
                    >
                        {enviando ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Aguardando IA...</span>
                            </>
                        ) : (
                            'Enviar lead'
                        )}
                    </button>
                </div>
            </form>

            {/* Painel discreto e explícito com os dados processados pela IA */}
            {leadProcessado && analiseLead && (
                <div className="bg-[#F8F9FB] rounded-2xl p-5 md:p-6 border border-slate-200/90 shadow-md text-slate-800 space-y-4">
                    {/* Cabeçalho explicativo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#EE4C01]" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#EE4C01]">
                                    Análise Concluída
                                </span>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-[#040136]">
                                Veja o processamento que a IA fez para este lead:
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                <strong className="text-slate-700">{leadProcessado.nome}</strong> • {leadProcessado.telefone || 'Sem telefone'} • Origem: {formatarOrigem(leadProcessado.origem)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setLeadProcessado(null)}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-700 self-start sm:self-center px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                        >
                            Fechar resultado ×
                        </button>
                    </div>

                    {/* Grade de dados da análise */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                        {/* 1. Dados Extraídos */}
                        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                Dados Extraídos
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Região:</span>
                                    <strong className="text-slate-700 font-semibold">{formatarTexto(analiseLead.regiao || leadProcessado.regiao)}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Tipo:</span>
                                    <strong className="text-slate-700 font-semibold">{formatarTexto(analiseLead.tipo_imovel || leadProcessado.tipo_imovel)}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Faixa de Valor:</span>
                                    <strong className="text-slate-700 font-semibold">{formatarTexto(analiseLead.faixa_valor || leadProcessado.faixa_valor)}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Prazo:</span>
                                    <strong className="text-slate-700 font-semibold">{formatarTexto(analiseLead.prazo_compra || leadProcessado.prazo_compra)}</strong>
                                </div>
                            </div>

                            {analiseLead.caracteristicas.length > 0 && (
                                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                                    {analiseLead.caracteristicas.map((item, idx) => (
                                        <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Qualificação & Lacunas */}
                        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                Qualificação & Lacunas
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">Intenção:</span>
                                {renderIntencaoBadge(analiseLead.intencao_compra || leadProcessado.intencao_compra)}
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <span className="text-[10px] text-slate-400 block mb-1">Dados a Qualificar:</span>
                                {analiseLead.dados_faltantes.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {analiseLead.dados_faltantes.map((item, idx) => (
                                            <span key={idx} className="text-[11px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Nenhum dado faltante crítico</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Análise Comercial & Próxima Ação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                Resumo Comercial da IA
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {analiseLead.resumo || 'Sem resumo disponível.'}
                            </p>
                        </div>

                        <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EE4C01]" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                                    Próxima Ação Recomendada
                                </span>
                            </div>
                            <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                                {analiseLead.proxima_acao || 'Nenhuma próxima ação identificada.'}
                            </p>
                        </div>
                    </div>

                    {/* 4. Mensagem Personalizada Sugerida */}
                    {(analiseLead.mensagem_sugerida || leadProcessado.mensagem_sugerida) && (
                        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                Mensagem Sugerida para Contato
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                {analiseLead.mensagem_sugerida || leadProcessado.mensagem_sugerida}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

