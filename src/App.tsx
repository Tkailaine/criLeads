import { useEffect, useState } from 'react'
import { buscarLeads } from './services/leads'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem, type LeadsPorOrigem, type QualificacaoPorOrigem } from './services/relatorios'
import './App.css'

//Testa a listagem de leads cadastrados no supabase
function App() {

  {/*const [leads, setLeads] = useState<unknown[]>([])
  const [erro, setErro] = useState('')
  const [leadOrigem, setLeadOrigem] = useState<LeadsPorOrigem[]>([])
  const [qualificacaoOrigem, setQualificacaoOrigem] = useState<QualificacaoPorOrigem[]>([])

  useEffect(() => {
    async function carregarLeads() {
      try {
        const dadosLeads = await buscarLeads()
        setLeads(dadosLeads ?? [])

        const dadosLeadOrigem = await buscarLeadsPorOrigem()
        setLeadOrigem(dadosLeadOrigem ?? [])
        
        const dadosQualificacaoOrigem = await buscarLeadsPercentualQualificadosOrigem()
        setQualificacaoOrigem(dadosQualificacaoOrigem ?? [])
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os leads.')
      }
    }
    carregarLeads()
  }, [])*/}

  return (
    <main>
      
     
    </main>
  )
}

export default App
