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
