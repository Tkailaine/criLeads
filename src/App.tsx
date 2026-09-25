import { useEffect, useState } from 'react'
import { buscarLeads } from './services/leads'
import './App.css'

function App() {

  const [leads, setLeads] = useState<unknown[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarLeads() {
      try {
        const dados = await buscarLeads()
        setLeads(dados ?? [])
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar os leads.')
      }
    }
    carregarLeads()
  }, [])

  return (
    <main>
      <h1>Leads</h1>
      {erro && <p>{erro}</p>}

      <p>total de leads: {leads.length}</p>

      <ul>
        {leads.map((lead, index) => (
          <li key={index}>
            {JSON.stringify(lead)}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
