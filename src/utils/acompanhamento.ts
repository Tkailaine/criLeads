//função calcula a quantidade de dias sem interação com o lead
export function calcularDiasSemContato(ultimoContato: string | null) {
  if (!ultimoContato) {
    return null
  }

  const agora = new Date()
  const ultimo = new Date(ultimoContato)

  const diferenca = agora.getTime() - ultimo.getTime()

  return Math.floor(diferenca / (1000 * 60 * 60 * 24))
}

//Aplica a regra de negócio de a partir de 10 dias é considerado como perdido e coloca uma margem de atenção
//a partir de 7 dias, não marcado como perdido

export function classificarAcompanhamento(ultimoContato: string | null) {
  const dias = calcularDiasSemContato(ultimoContato)

  if (dias === null) {
    return 'sem_contato'
  }

  if (dias >= 10) {
    return 'perdido'
  }

  if (dias >= 7) {
    return 'atencao'
  }

  return 'normal'
}