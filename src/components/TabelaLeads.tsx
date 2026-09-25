import type { Lead } from '../services/leads'
import { useState } from 'react'

type TabelaLeadsProps = {
    leads: Lead[]
}
export default function TabelaLeads({ leads }: TabelaLeadsProps) {

    const [filtroStatus, setFiltroStatus] = useState('')
    const [filtroOrigem, setFiltroOrigem] = useState('')
    const [filtroIntencao, setFiltroIntencao] = useState('')
    const [filtroFaixaValor, setFiltroFaixaValor] = useState('')
    const [filtroRegiao, setFiltroRegiao] = useState('')

    //função que filtra os leads com base nos filtros selecionados
    const leadsFiltrados = leads.filter((lead) => {
        const correspondeStatus =
            !filtroStatus || lead.status === filtroStatus

        const correspondeOrigem =
            !filtroOrigem || lead.origem === filtroOrigem

        const correspondeIntencao =
            !filtroIntencao || lead.intencao_compra === filtroIntencao

        const correspondeFaixaValor =
            !filtroFaixaValor || lead.faixa_valor === filtroFaixaValor

        const correspondeRegiao =
            !filtroRegiao || lead.regiao === filtroRegiao

        return (
            correspondeStatus &&
            correspondeOrigem &&
            correspondeIntencao &&
            correspondeFaixaValor &&
            correspondeRegiao
        )
    })

    return (
        <section>
            <h2>Todos os leads cadastrados</h2>
            {/* Exibe filtro para usuário selecionar */}
            <div>
                <label>Status: </label>
                <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="novo">Novo</option>
                <option value="em_contato">Em contato</option>
                <option value="qualificado">Qualificado</option>
                <option value="perdido">Perdido</option> 
                </select>
            </div>

            {/* tabela com os leads */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Origem</th>
                        <th>Status</th>
                        <th>Região</th>
                        <th>Tipo de imóvel</th>
                        <th>Faixa de valor</th>
                        <th>Intenção de compra</th>
                    </tr>
                </thead>

                <tbody>
                    {leadsFiltrados.map((lead) => (
                        <tr key={lead.id}>
                            <td>{lead.nome}</td>
                            <td>{lead.origem}</td>
                            <td>{lead.status}</td>
                            <td>{lead.regiao ?? '-'}</td>
                            <td>{lead.tipo_imovel ?? '-'}</td>
                            <td>{lead.faixa_valor ?? '-'}</td>
                            <td>{lead.intencao_compra ?? '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}