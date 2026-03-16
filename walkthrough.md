# 🌎 CidadãoAI — Walkthrough

**CidadãoAI** foi criado com sucesso na pasta `Projeto`. O projeto é uma plataforma web de assistência digital para cidadãos brasileiros, voltada para impacto social.

## O que foi construído

### Estrutura de Arquivos
```
Projeto/
├── index.html       ← Landing page completa
├── app.html         ← Chatbot principal
├── css/
│   ├── style.css    ← Design system da landing page
│   └── app.css      ← Estilos do app chatbot
├── js/
│   ├── main.js      ← Lógica da landing page (animações, demo)
│   └── app.js       ← Motor do chatbot com base de conhecimento
├── assets/
│   └── hero.png     ← Ilustração principal (gerada por IA)
└── README.md        ← Documentação do projeto
```

## Evidências Visuais

### Landing Page

![Landing Page — CidadãoAI](/C:/Users/brn_1/.gemini/antigravity/brain/9b912dc7-9e1f-4cfe-873e-d5c1ffa53844/landing_screenshot.png)

### Seção Demo e Chat

![Seção de Demonstração do Chatbot](/C:/Users/brn_1/.gemini/antigravity/brain/9b912dc7-9e1f-4cfe-873e-d5c1ffa53844/demo_screenshot.png)

### Gravação de Tela

![Gravação da Landing Page](/C:/Users/brn_1/.gemini/antigravity/brain/9b912dc7-9e1f-4cfe-873e-d5c1ffa53844/cidadao_ai_landing_1773615118128.webp)

## Funcionalidades Implementadas

### 🎨 Design (30% dos critérios dos juízes)
- **Dark theme premium** com glassmorphism e orbs de luz animados
- Paleta de cores curada: teal `#3ecfb2` + purple `#7c3aed` sobre fundo `#080b14`
- Tipografia **Plus Jakarta Sans** (Google Fonts)
- Animações: scroll-reveal, floating card, hero float, pulsing status indicator
- Totalmente responsivo (mobile, tablet, desktop)
- **WCAG 2.1 AA** — suporte a leitores de tela, contraste, ARIA labels

### 🧠 Implementação Técnica (20% dos critérios dos juízes)
- Chatbot com **base de conhecimento** em 8 categorias cívicas brasileiras
- **Detecção de intenção** por palavras-chave em português
- **Web Speech API** para entrada por voz e TTS (leitura de respostas)
- Painel de acessibilidade com: tamanho de fonte, alto contraste, voz
- Zero dependências externas — apenas HTML, CSS e JS puros
- Vanilla CSS com sistema de design próprio (> 800 linhas)

### 💚 Impacto Social (25% dos critérios dos juízes)
- **8 categorias** de direitos e serviços: INSS, Bolsa Família, SUS, Trabalho, Educação, Habitação, Documentos, Direitos do Idoso
- **70M+ brasileiros** com baixa digitalização como público-alvo
- Linguagem simplificada, sem juridiquês
- Links diretos para portais governamentais oficiais
- Suporte a LIBRAS e acessibilidade universal

### 💡 Inovação (25% dos critérios dos juízes)
- Chatbot especializado em cidadania brasileira
- Interface 100% offline — funciona sem servidor ou cadastro
- Pronto para integração com APIs Gov.br e Gemini AI
- Arquitetura modular extensível para municípios parceiros

## Como Executar

1. Abrir o arquivo [Projeto/index.html](file:///c:/Users/brn_1/Documents/user%5B/Projeto/index.html) no navegador
2. Clicar em **"Acessar App"** para ir ao chatbot
3. Digitar qualquer dúvida sobre direitos ou serviços públicos
