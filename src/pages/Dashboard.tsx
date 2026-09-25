import { useEffect, useState } from 'react'
import { buscarLeads, type Lead } from '../services/leads'

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

            <p>Total de leads: {leads.length}</p>
        </main>
    )
}