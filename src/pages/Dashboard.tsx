import { useEffect, useState } from 'react'
import { buscarLeads, type Lead } from '../services/leads'
import Indicadores  from '../components/Indicadores'
import TabelaLeads from '../components/TabelaLeads'

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([])

    useEffect(() => {
        async function carregarLeads() {
            try {
                const dados = await buscarLeads()
                setLeads(dados ?? [])
            } catch (error) {
                console.error(error)
            }
        }

        carregarLeads()
    }, [])

    return (
        <main>
            <h1>Dashboard</h1>

            <Indicadores leads={leads}/>
            <TabelaLeads leads={leads}/>
        </main>
    )
}