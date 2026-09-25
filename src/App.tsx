import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

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
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
