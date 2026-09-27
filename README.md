# CRI Soluções Imobiliárias — Qualificação Inteligente de Leads

> Sistema de qualificação, organização e análise comercial de leads desenvolvido para o case técnico da CRI Soluções Imobiliárias.

<p align="center">
  <a href="https://cri-leads-eight.vercel.app/">
    <img src="https://img.shields.io/badge/Aplicação-Online-040136?style=for-the-badge" alt="Aplicação Online">
  </a>
  <a href="https://github.com/Tkailaine">
    <img src="https://img.shields.io/badge/GitHub-Repositório-040136?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

## 🚀 Acesse a aplicação

### [→ Abrir Dashboard](https://cri-leads-eight.vercel.app/)

A aplicação está publicada e pode ser testada diretamente pelo navegador.

> **Para explorar o sistema:** abra a base de leads e clique em um lead para visualizar o detalhamento completo da qualificação. No modal, observe principalmente os campos **Análise Comercial**, **Próxima Ação** e **Mensagem Sugerida**.

---

## 📌 Sobre o projeto

O projeto foi desenvolvido com o objetivo de transformar informações inicialmente desestruturadas de leads em dados organizados e úteis para o processo comercial.

A solução recebe o interesse informado pelo potencial cliente, utiliza inteligência artificial para extrair e estruturar informações relevantes, classifica a intenção de compra, identifica dados que ainda precisam ser descobertos e gera recomendações para apoiar o próximo contato do consultor.

O resultado é apresentado em um dashboard que combina:

- Visão geral da carteira;
- Indicadores comerciais (KPI's);
- Análise por origem;
- Qualificação dos leads;
- Alertas de acompanhamento leads;
- Recomendações comerciais;
- Detalhamento individual dos leads;
- Mensagens personalizadas para atendimento.

---

## 🖥️ Dashboard

![Dashboard](docs/dashboard.jpg)

O dashboard foi desenvolvido para permitir que o consultor tenha uma visão rápida da carteira e consiga partir dos indicadores gerais para a análise individual dos leads.

Entre as informações apresentadas estão:

- Total de leads;
- Distribuição por origem;
- Percentual de qualificação por origem;
- Alertas de acompanhamento;
- Recomendações baseadas nos dados da carteira;
- Base completa de leads;
- Filtros por informações estruturadas.

---

## 🔎 Detalhamento de um lead

![Detalhamento do Lead](docs/lead-modal.jpg)

Ao clicar em um lead da tabela, é aberto um modal com as informações estruturadas durante o processamento.

O consultor consegue visualizar:

| Informação | Objetivo |
|---|---|
| **Região** | Identificar a região de interesse |
| **Tipo de imóvel** | Entender o perfil do imóvel procurado |
| **Características** | Entender preferências do cliente |
| **Faixa de valor** | Identificar o orçamento informado |
| **Prazo de compra** | Identificar proximidade da decisão |
| **Intenção de compra** | Indentificar o interesse do cliente |
| **Dados faltantes** | Indicar informações que ainda precisam ser descobertas |
| **Resumo** | Sintetizar os principais sinais comerciais |
| **Próxima ação** | Orientar o próximo passo do atendimento |
| **Mensagem sugerida** | Recomendar mensagem personalizada |

---

## 💬 Mensagem sugerida

A **Mensagem Sugerida** é gerada pela inteligência artificial a partir das informações fornecidas pelo lead.

A geração considera também a **origem do lead**, adaptando o tom da comunicação:

- **WhatsApp:** linguagem natural, próxima e conversacional;
- **Site:** comunicação profissional, consultiva e objetiva;
- **Indicação:** comunicação mais acolhedora e pessoal.

O objetivo é evitar mensagens genéricas e fornecer ao consultor uma sugestão de abordagem baseada no contexto daquele lead.

---

## 💡 Recomendações comerciais

![Recomendações](docs/recomendacoes.jpg)

A seção de recomendações foi pensada para ir além da simples apresentação dos indicadores.

Os dados disponíveis são combinados para identificar relações que podem apoiar decisões comerciais, como:

- Regiões que concentram maior volume e qualificação;
- Combinações entre perfil de imóvel e faixa de valor;
- Canais que apresentam maior volume ou melhor desempenho de qualificação.

A proposta é transformar os dados coletados durante a entrada do lead em informações que possam apoiar decisões sobre priorização, acompanhamento e análise dos canais de aquisição.

---

## 🧪 Simulação de novos leads

![Simulação de Lead](docs/simulador-lead1.jpg)

![Simulação de Lead Continuação](docs/simulador-lead2.jpg)

O dashboard possui uma área de simulação que permite testar o processamento de novos leads.

O fluxo funciona da seguinte maneira:

```text
Lead
  ↓
Formulário
  ↓
Webhook
  ↓
n8n
  ↓
Gemini
  ↓
Extração e qualificação
  ↓
Normalização
  ↓
Supabase
  ↓
Dashboard
```

A partir de uma mensagem de interesse, o sistema pode identificar informações como:

- Região;
- Tipo de imóvel;
- Características;
- Faixa de valor;
- Prazo de compra;
- Intenção de compra;
- Dados faltantes;
- Análise comercial;
- Próxima ação;
- Mensagem sugerida.

---

## 🏗️ Arquitetura

A solução foi dividida em três partes principais:

### Front-end
Responsável pela interface, visualização dos dados, filtros, indicadores, recomendações e interação com os leads.
- **Tecnologias:** React + TypeScript + Tailwind CSS

### Automação
Responsável por receber o evento, orquestrar o processamento e conectar a inteligência artificial ao banco de dados.
- **Tecnologias:** n8n + Gemini

### Persistência
Responsável pelo armazenamento estruturado dos leads e pelas consultas utilizadas pelo dashboard.
- **Tecnologias:** Supabase / PostgreSQL

### Visão geral

```text
┌─────────────────────────┐
│       React Dashboard   │
│   TypeScript + Tailwind │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         Supabase        │
│        PostgreSQL       │
└────────────▲────────────┘
             │
             │
┌────────────┴────────────┐
│          n8n            │
│        Webhook          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        Gemini / IA      │
│ Extração + Qualificação │
└─────────────────────────┘
```

---

## 🛠️ Tecnologias

| Tecnologia | Utilização |
|---|---|
| **React** | Construção da interface |
| **TypeScript** | Tipagem e segurança no desenvolvimento |
| **Tailwind CSS** | Estilização da aplicação |
| **Vite** | Build e ambiente de desenvolvimento |
| **Supabase** | Banco de dados PostgreSQL hospedado |
| **n8n** | Orquestração da automação |
| **Gemini** | Extração, classificação e análise dos leads |
| **Vercel** | Publicação do dashboard |

---

## 🧠 Inteligência artificial

A IA não é utilizada apenas para gerar texto. Ela participa do processo de estruturação e qualificação inicial do lead.

A partir do texto de interesse, o agente foi configurado para:

- Analisar somente as informações fornecidas pelo cliente;
- Extrair informações relevantes;
- Estruturar os dados em campos definidos;
- Classificar a intenção de compra;
- Identificar informações importantes ainda ausentes;
- Gerar um resumo comercial;
- Sugerir uma próxima ação;
- Gerar uma mensagem personalizada.

A classificação de intenção utiliza quatro categorias:

- `alta`
- `media`
- `pesquisando`
- `nao_identificada`

> A intenção representa uma análise inicial baseada nas informações disponíveis e não uma decisão definitiva sobre a qualidade do lead.

---

## 🧩 Padronização dos dados

Durante os testes foi identificado que a mesma informação poderia ser retornada de formas diferentes pela IA.

Por exemplo, uma mesma região poderia aparecer com variações de escrita.

Para evitar que essas variações fragmentassem os filtros e as análises, foi definida uma estrutura padronizada para campos como:

- Região;
- Faixa de valor;
- Intenção de compra;
- Origem;
- Status;
- Prioridade.

A normalização acontece antes da persistência dos dados. Dessa forma, o banco mantém valores consistentes e o dashboard consegue agrupar e filtrar as informações corretamente.

---

## 🔐 Idempotência

O fluxo possui uma chave de idempotência para evitar a criação duplicada de leads.

Isso é importante principalmente em integrações baseadas em webhooks, onde uma mesma requisição pode ser reenviada.

O comportamento esperado é:

```text
Evento 1
   ↓
chave_idempotencia = ABC123
   ↓
Lead criado


Evento 2
   ↓
chave_idempotencia = ABC123
   ↓
Lead já existente
   ↓
Não criar duplicação
```

---

## ⚙️ Regras de acompanhamento

Foi implementada uma regra operacional baseada no tempo desde o último contato.

Leads que se aproximam do limite de acompanhamento recebem um alerta no dashboard, permitindo que o consultor identifique contatos que precisam de atenção.

A regra considera o cenário comercial em que uma carteira maior pode tornar difícil controlar manualmente todos os follow-ups.

---

## 🧪 Testes realizados

Foram realizados testes em diferentes partes do fluxo.

### Idempotência
A mesma chave de idempotência foi utilizada em duas submissões para simular o recebimento duplicado de um lead. O segundo registro não foi criado.

### Validação de formulário
Foram realizados testes com campos obrigatórios ausentes, incluindo:
- Nome;
- Telefone;
- Texto de interesse.

### Processamento da IA
Foram realizados testes para validar:
- Extração de região;
- Extração de tipo de imóvel;
- Características;
- Faixa de valor;
- Prazo de compra;
- Intenção de compra;
- Dados faltantes;
- Análise comercial;
- Próxima ação;
- Mensagem sugerida;
- Personalização por origem.

### Teste da integração
Foram processados aproximadamente 40 leads durante os testes, incluindo exclusão e novos cadastros para validar novamente o fluxo completo.

---

## 📂 Estrutura do projeto

```text
src/
├── components/
│   ├── Indicadores
│   ├── TabelaLeads
│   ├── LeadsPorOrigem
│   ├── QualificacaoPorOrigemCard
│   ├── InsightsOperacionais
│   └── ...
│
├── pages/
│
├── services/
│   ├── leads
│   └── relatorios
│
├── utils/
│   ├── acompanhamento
│   └── formatter
│
└── lib/
    └── supabase
```

---

## 💻 Como executar localmente

### Pré-requisitos
- Node.js
- npm
- Projeto no Supabase
- Webhook do n8n configurado

### 1. Clonar o projeto
```bash
git clone https://github.com/Tkailaine/criLeads
cd criLeads
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_N8N_WEBHOOK_URL=
```

Preencha os valores de acordo com o ambiente utilizado.


### 4. Executar em desenvolvimento
```bash
npm run dev
```

### 5. Gerar build de produção
```bash
npm run build
```

### 6. Visualizar a build
```bash
npm run preview
```


## 📈 Possíveis evoluções

Com mais tempo, algumas evoluções planejadas seriam:

- Automatizar a alteração de status para leads sem contato por 10 dias ou mais;
- Utilizar histórico de mensagens e dados extraídos para identificar padrões comerciais;
- Integrar o fluxo diretamente ao WhatsApp;
- Evoluir o atendimento automatizado até a transferência para um consultor;
- Conectar um catálogo de imóveis ao sistema;
- Utilizar os dados de interesse do cliente para recomendar imóveis compatíveis;
- Implementar filas para suportar maior volume de processamento;
- Evoluir as recomendações comerciais conforme novos dados de conversão sejam acumulados.

---

## 📄 Documentação do case

A documentação detalhada do desenvolvimento, decisões técnicas, regras de negócio, utilização de inteligência artificial, dificuldades encontradas e possibilidades de evolução está disponível em:

**Documentação Técnica — Etapa 5**
EM BREVE
---

## 👩‍💻 Autora

**Thaissa Kailaine**
