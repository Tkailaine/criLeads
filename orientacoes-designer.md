# CRI Leads Dashboard — Design Guidelines

## 1. Contexto

Este projeto é um dashboard interno de gestão e análise de leads para a CRI Soluções Imobiliárias, empresa do setor imobiliário de Santa Catarina.

O sistema deve transmitir:

- confiança
- sofisticação
- credibilidade
- organização
- modernidade
- eficiência comercial

O produto NÃO deve parecer um dashboard SaaS genérico.

A identidade visual deve ser inspirada na identidade visual do site institucional da CRI, cuja imagem de referência será fornecida ao agente durante o desenvolvimento.

A imagem fornecida pelo usuário deve ser considerada a principal referência visual para:

- proporções
- linguagem visual
- uso das cores
- tipografia
- espaçamento
- estilo de cards
- tratamento de imagens
- estilo de botões
- hierarquia visual
- sensação geral da marca

Não copiar literalmente elementos do site. Adaptar a linguagem visual para um sistema interno de gestão.

---

# 2. Paleta oficial

## Azul escuro

HEX:

#040136

É a principal cor institucional.

Usar em:

- sidebar
- headers importantes
- áreas de destaque
- títulos ou elementos institucionais
- fundos de seções importantes

---

## Laranja

HEX:

#EE4C01

É a principal cor de ação e destaque.

Usar em:

- CTAs
- alertas
- leads que precisam de atenção
- prioridade alta
- indicadores importantes
- elementos selecionados
- ações principais

O laranja NÃO deve dominar a interface.

Deve funcionar como uma cor de atenção e ação.

---

## Azul destaque

HEX:

#2201B2

Usar como cor secundária.

Pode ser utilizado em:

- gráficos
- links
- indicadores secundários
- elementos selecionados
- pequenos destaques

Evitar utilizar o azul #2201B2 como cor predominante da interface.

---

## Neutros

Utilizar:

#FFFFFF

para superfícies principais.

Utilizar tons muito claros de cinza para:

- background geral
- áreas secundárias
- tabelas
- separadores

Exemplos:

#F5F5F5
#F7F7F7
#EAEAEA

Textos secundários devem utilizar cinzas neutros, evitando preto puro em excesso.

---

# 3. Tipografia

Fonte principal:

Montserrat.

Utilizar:

- 700 para títulos principais
- 600 para títulos de seção
- 500 para labels e informações importantes
- 400 para textos secundários

A identidade visual pode utilizar uma fonte próxima da Proxima Nova em alguns contextos caso exista disponibilidade adequada.

A tipografia deve ter boa hierarquia.

Evitar:

- títulos gigantes
- excesso de texto em negrito
- fontes muito decorativas
- fontes futuristas

---

# 4. Bordas e componentes

Os componentes devem possuir arredondamento leve.

Preferir:

border-radius aproximadamente entre 6px e 10px.

Evitar:

- cards extremamente arredondados
- pills em excesso
- botões gigantes
- elementos com aparência infantil

Os componentes devem parecer parte de um produto corporativo.

---

# 5. Sombras

Utilizar sombras muito discretas.

Preferir:

- bordas suaves
- contraste entre superfícies
- sombras leves

Evitar:

- sombras fortes
- efeitos 3D
- glow
- neon

---

# 6. Direção visual

A interface deve combinar:

CRI institucional
+
sistema comercial
+
dashboard executivo

O resultado deve parecer um sistema desenvolvido especificamente para uma empresa imobiliária consolidada.

Não deve parecer:

- template administrativo genérico
- dashboard de startup fintech
- sistema gamer
- painel excessivamente tecnológico
- clone de Power BI
- interface genérica do shadcn sem personalização

---

# 7. Estrutura do produto

O produto terá SOMENTE UMA PÁGINA E FUTURAMENTE MAIS UMA, MAS NO MOMENTO APENAS UMA.

## Página 1 — Dashboard

Objetivo:

Mostrar uma visão executiva dos leads.

Deve responder:

"Como estão os meus leads?"

"De onde eles estão vindo?"

"Quantos estão sendo qualificados?"

"Quais precisam de atenção?"

"Quais padrões podemos identificar?"

A página deve conter:

### Header

Título:

Visão geral dos leads

Subtítulo:

Acompanhe a entrada, qualificação e evolução dos seus leads.

IMPORTANTE: a lógica já está implementada no código, você só irá estilizar. Não deverá criar novas funcionalidades ou mexer na regra de negócio, seu papel é apenas estilizar o que já foi construido

---

### KPIs


Os KPIs devem possuir:

- número principal
- label
- comparação com período anterior quando aplicável
- pequeno indicador visual de tendência

---

### Alerta de atenção

Mostrar na página principal um destaque quando existirem leads que precisam de acompanhamento.

Exemplo:

"X leads precisam de atenção"

"Existem leads sem contato recente que podem representar oportunidades de negócio."

Só estilize o campo. a lógica ainda será implementada e posteriormente será conectado o número de leads manualmente, seu papel é apenas
o desenvolvimento da estilização.

CTA:

"Ver leads que precisam de atenção"

Esse CTA deve levar à segunda página futura que será criada posteriormente.

---

### Leads por origem

Mostrar:

WhatsApp
Site
Indicação

O gráfico deve permitir entender:

- quantidade
- percentual
- participação de cada origem

---

### Qualificação por origem

Mostrar a porcentagem de leads qualificados dentro de cada origem.

Exemplo:

WhatsApp — 38%
Site — 31%
Indicação — 42%

A intenção é comparar:

volume de leads

versus

qualidade dos leads.

---

### Simulação de novo lead

Na própria página Dashboard deve existir uma seção:

"Simular novo lead"

Objetivo:

Permitir que um avaliador/recrutador teste a automação.

Campos:

Nome

Telefone

Texto de interesse

Botão:

Enviar lead


estilize apenas o formulário sem aplicar nenhuma lógica.
---



# 8. Princípio principal de UX

O sistema não deve simplesmente apresentar dados.

Ele deve ajudar o usuário a decidir:

"Qual origem está trazendo melhores leads?"

"Quais oportunidades estão sendo esquecidas?"


O design deve favorecer essas respostas.

---

# 9. Tecnologia

Utilizar:

React
TypeScript
Tailwind CSS

Arquitetura organizada.


Criar componentes reutilizáveis.

Não criar backend.

Não criar autenticação.

Não criar banco.

Apenas entender o que foi construido e cuidar da estilização.

Preparar o formulário para integração futura com webhook n8n.

---

# 10. Regra de ouro

A imagem do site da CRI fornecida pelo usuário durante o desenvolvimento é a principal referência estética.

Antes de criar componentes, analisar visualmente:

- cores
- proporção das cores
- tipografia
- espaçamento
- estilo dos cards
- tratamento das imagens
- botões
- bordas
- composição
- densidade visual

Depois adaptar essa identidade para um dashboard de sistema interno.

Não copiar o site.

Criar uma linguagem própria para o dashboard mantendo a identidade da marca.