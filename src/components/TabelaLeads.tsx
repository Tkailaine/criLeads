import type { Lead } from '../services/leads'

type TabelaLeadsProps = {
    leads: Lead[]
}
export default function TabelaLeads({ leads } : TabelaLeadsProps){
    return(
        <section>
            <h2>Todos os leads cadastrados</h2>
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
                    {leads.map((lead) => (
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