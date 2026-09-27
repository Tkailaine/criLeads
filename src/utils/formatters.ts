import type { Lead } from '../services/leads'

// Funções e mapeamentos de apresentação para exibição amigável na interface
// Sem alterar os dados brutos armazenados no banco de dados

export const ORIGENS_LABEL: Record<string, string> = {
    whatsapp: 'WhatsApp',
    site: 'Site',
    indicacao: 'Indicação',
    indicacao_cliente: 'Indicação de Cliente',
    instagram: 'Instagram',
    facebook: 'Facebook',
    google: 'Google',
    outro: 'Outro'
}

export const ORIGENS_UPPER_LABEL: Record<string, string> = {
    whatsapp: 'WHATSAPP',
    site: 'SITE',
    indicacao: 'INDICAÇÃO',
    indicacao_cliente: 'INDICAÇÃO',
    instagram: 'INSTAGRAM',
    facebook: 'FACEBOOK',
    google: 'GOOGLE'
}

export const STATUS_LABEL: Record<string, string> = {
    novo: 'Novo',
    em_contato: 'Em Contato',
    qualificado: 'Qualificado',
    perdido: 'Perdido',
    nao_qualificado: 'Não Qualificado'
}

export const PRIORIDADE_LABEL: Record<string, string> = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
}

export const REGIOES_LABEL: Record<string, string> = {
    balneario_camboriu: 'Balneário Camboriú',
    itapema: 'Itapema',
    praia_brava: 'Praia Brava',
    itajai: 'Itajaí',
    porto_belo: 'Porto Belo',
    litoral: 'Litoral',
    nao_identificada: 'Não identificada'
}

export const FAIXAS_VALOR_LABEL: Record<string, string> = {
    ate_1_milhao: 'Até R$ 1 milhão',
    de_1_a_2_milhoes: 'R$ 1 a 2 milhões',
    de_2_a_3_milhoes: 'R$ 2 a 3 milhões',
    de_3_a_4_milhoes: 'R$ 3 a 4 milhões',
    de_4_a_5_milhoes: 'R$ 4 a 5 milhões',
    acima_de_5_milhoes: 'Acima de R$ 5 milhões',
    nao_identificada: 'Não identificada'
}

export const INTENCAO_LABEL: Record<string, string> = {
    alta: 'Alta',
    media: 'Média',
    média: 'Média',
    baixa: 'Baixa',
    pesquisando: 'Pesquisando',
    nao_identificada: 'Não identificada',
    não_identificada: 'Não identificada',
    nao_identificado: 'Não identificada',
    não_identificado: 'Não identificada'
}

export function formatarRegiao(regiao: string | null | undefined): string {
    if (!regiao) return '-'

    const chave = regiao.toLowerCase().trim()

    return REGIOES_LABEL[chave] || formatarTexto(regiao)
}

export function formatarFaixaValor(faixa: string | null | undefined): string {
    if (!faixa) return '-'

    const chave = faixa.toLowerCase().trim()

    return FAIXAS_VALOR_LABEL[chave] || formatarTexto(faixa)
}

export function formatarIntencao(intencao: string | null | undefined): string {
    if (!intencao) return '-'

    const chave = intencao.toLowerCase().trim()
    const chaveSemAcento = chave.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return INTENCAO_LABEL[chave] || INTENCAO_LABEL[chaveSemAcento] || formatarTexto(intencao)
}
export function formatarOrigem(origem: string | null | undefined, uppercase = false): string {
    if (!origem) return '-'
    const chave = origem.toLowerCase().trim()
    if (uppercase) {
        return ORIGENS_UPPER_LABEL[chave] || origem.toUpperCase()
    }
    return ORIGENS_LABEL[chave] || origem
}

export function formatarStatus(status: string | null | undefined): string {
    if (!status) return '-'
    const chave = status.toLowerCase().trim()
    return STATUS_LABEL[chave] || status
}

export function formatarPrioridade(prioridade: string | null | undefined): string {
    if (!prioridade) return '-'
    const chave = prioridade.toLowerCase().trim()
    return PRIORIDADE_LABEL[chave] || prioridade
}

export function formatarPercentual(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined) return '0%'
    const num = typeof valor === 'string' ? parseFloat(valor) : valor
    if (isNaN(num)) return '0%'
    return `${num.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

export function formatarData(data: string | null | undefined): string {
    if (!data) return '-'
    const d = new Date(data)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('pt-BR')
}

export function formatarTexto(texto: string | null | undefined): string {
    if (!texto) return '-'
    const trimmed = texto.trim()
    if (!trimmed) return '-'
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

// Normaliza arrays que possam vir como array de strings, string JSON ou string separada por vírgulas
export function normalizarArray(valor: unknown): string[] {
    if (!valor) return []
    if (Array.isArray(valor)) {
        return valor
            .map((item) => (typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item).trim()))
            .filter(Boolean)
    }
    if (typeof valor === 'string') {
        const trimmed = valor.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) {
                    return parsed
                        .map((item) => (typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item).trim()))
                        .filter(Boolean)
                }
            } catch {
                // Se falhar o parse, segue para o tratamento de texto
            }
        }
        if (trimmed.includes(',')) {
            return trimmed.split(',').map((s) => s.trim()).filter(Boolean)
        }
        if (trimmed) {
            return [trimmed]
        }
    }
    return []
}

export type DadosIAExtraidos = {
    regiao: string | null
    tipo_imovel: string | null
    caracteristicas: string[]
    faixa_valor: string | null
    prazo_compra: string | null
    intencao_compra: string | null
    dados_faltantes: string[]
    resumo: string | null
    proxima_acao: string | null
    mensagem_sugerida: string | null
}

// Extrai de forma segura todos os dados processados pela IA de um lead
export function extrairDadosIA(lead: Lead): DadosIAExtraidos {
    const dados = lead as Record<string, any>

    let regiao = dados.regiao || dados.dados_extraidos?.regiao || null
    let tipo_imovel = dados.tipo_imovel || dados.dados_extraidos?.tipo_imovel || null
    let faixa_valor = dados.faixa_valor || dados.dados_extraidos?.faixa_valor || null
    let prazo_compra = dados.prazo_compra || dados.dados_extraidos?.prazo_compra || null
    let intencao_compra = dados.intencao_compra || dados.qualificacao?.intencao_compra || null
    let mensagem_sugerida = dados.mensagem_sugerida || null
    let resumo = dados.resumo || dados.analise_comercial?.resumo || null
    let proxima_acao = dados.proxima_acao || dados.analise_comercial?.proxima_acao || null

    if (typeof dados.analise_comercial === 'string') {
        try {
            const parsed = JSON.parse(dados.analise_comercial)
            if (typeof parsed === 'object' && parsed !== null) {
                if (!resumo && parsed.resumo) resumo = parsed.resumo
                if (!proxima_acao && parsed.proxima_acao) proxima_acao = parsed.proxima_acao
            } else if (!resumo) {
                resumo = dados.analise_comercial
            }
        } catch {
            if (!resumo) resumo = dados.analise_comercial
        }
    }

    if (typeof dados.dados_extraidos === 'string') {
        try {
            const parsed = JSON.parse(dados.dados_extraidos)
            if (typeof parsed === 'object' && parsed !== null) {
                if (!regiao && parsed.regiao) regiao = parsed.regiao
                if (!tipo_imovel && parsed.tipo_imovel) tipo_imovel = parsed.tipo_imovel
                if (!faixa_valor && parsed.faixa_valor) faixa_valor = parsed.faixa_valor
                if (!prazo_compra && parsed.prazo_compra) prazo_compra = parsed.prazo_compra
            }
        } catch {
            // Ignora erro de parse
        }
    }

    if (typeof dados.qualificacao === 'string') {
        try {
            const parsed = JSON.parse(dados.qualificacao)
            if (typeof parsed === 'object' && parsed !== null) {
                if (!intencao_compra && parsed.intencao_compra) intencao_compra = parsed.intencao_compra
            }
        } catch {
            // Ignora erro de parse
        }
    }

    const rawCaracteristicas = dados.caracteristicas || dados.dados_extraidos?.caracteristicas
    const caracteristicas = normalizarArray(rawCaracteristicas)

    const rawDadosFaltantes = dados.dados_faltantes || dados.analise_comercial?.dados_faltantes || dados.qualificacao?.dados_faltantes
    const dados_faltantes = normalizarArray(rawDadosFaltantes)

    return {
        regiao: typeof regiao === 'string' && regiao.trim() ? regiao.trim() : null,
        tipo_imovel: typeof tipo_imovel === 'string' && tipo_imovel.trim() ? tipo_imovel.trim() : null,
        caracteristicas,
        faixa_valor: typeof faixa_valor === 'string' && faixa_valor.trim() ? faixa_valor.trim() : null,
        prazo_compra: typeof prazo_compra === 'string' && prazo_compra.trim() ? prazo_compra.trim() : null,
        intencao_compra: typeof intencao_compra === 'string' && intencao_compra.trim() ? intencao_compra.trim() : null,
        dados_faltantes,
        resumo: typeof resumo === 'string' && resumo.trim() ? resumo.trim() : null,
        proxima_acao: typeof proxima_acao === 'string' && proxima_acao.trim() ? proxima_acao.trim() : null,
        mensagem_sugerida: typeof mensagem_sugerida === 'string' && mensagem_sugerida.trim() ? mensagem_sugerida.trim() : null
    }
}

