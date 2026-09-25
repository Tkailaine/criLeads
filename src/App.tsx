import { useEffect, useState } from 'react'
import { buscarLeads } from './services/leads'
import { buscarLeadsPorOrigem, buscarLeadsPercentualQualificadosOrigem } from './services/relatorios'
import './App.css'

//Testa a listagem de leads cadastrados no supabase
function App() {

  const [leads, setLeads] = useState<unknown[]>([])
  const [erro, setErro] = useState('')
  const [relatorio, setRelatorio] = useState<unknown[]>([])

  useEffect(() => {
    async function carregarLeads() {
      try {
        const dados = await buscarLeads()
        setLeads(dados ?? [])

        {/*const dadosRelatorio = await buscarLeadsPorOrigem()
        setRelatorio(dadosRelatorio ?? [])*/}
        
        const dadosRelatorio = await buscarLeadsPercentualQualificadosOrigem()
        setRelatorio(dadosRelatorio ?? [])
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os leads.')
      }
    }
    carregarLeads()
  }, [])

  return (
    <main>
      {/*<h1>Leads</h1>
      {erro && <p>{erro}</p>}

      <p>total de leads: {leads.length}</p>

      <ul>
        {leads.map((lead, index) => (
          <li key={index}>
            {JSON.stringify(lead)}
          </li>
        ))}
      </ul>*/}


     {/*<h1>Relatórios</h1>
      }
      { erro && <p>{erro}</p>}
      <ul>
        {relatorio.map((relatorio, index) => {
          return(
            <li key={index}>
              {JSON.stringify(relatorio)}
            </li>
          )
        })}
      </ul>*/}

      {/*Lista de Leads por Origem Percentual*/}
      <h1>Leads por Origem Percentual</h1>
      {erro && <p>{erro}</p>}
      <ul>
        {relatorio.map((relatorio, index) => {
          return(
            <li key={index}>
              {JSON.stringify(relatorio)}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default App
