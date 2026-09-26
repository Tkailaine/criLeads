import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DefaultLayout from './layouts/DefaultLayout'
import AtencaoLeads from './pages/AtencaoLeads'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/atencao' element={<AtencaoLeads />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
