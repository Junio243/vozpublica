/* ==========================================
   VozPública — App Engine (app.js)
   Chatbot com base de conhecimento de
   direitos cívicos brasileiros + Gemini AI
   ========================================== */

'use strict';

// ══════════════════════════════════════════════
// KNOWLEDGE BASE — Fallback when offline / no API key
// ══════════════════════════════════════════════
const KB = {
  inss: {
    title: '🏛️ INSS & Aposentadoria',
    text: `<strong>📋 Tipos de Aposentadoria (após Reforma 2019):</strong><br><br>
<ul>
  <li>🔸 <strong>Por idade:</strong> Mulher 62 anos + 15 anos contribuição | Homem 65 anos + 20 anos contribuição</li>
  <li>🔸 <strong>Por tempo de contribuição:</strong> Extinta para novos segurados — regras de transição aplicáveis</li>
  <li>🔸 <strong>Especial:</strong> Para quem trabalhou exposto a agentes nocivos (15/20/25 anos)</li>
  <li>🔸 <strong>Por invalidez:</strong> Quando há incapacidade permanente para o trabalho</li>
  <li>🔸 <strong>Rural:</strong> Mulher 55 anos | Homem 60 anos + comprovação de atividade rural</li>
</ul><br>
<strong>📞 Como solicitar:</strong><br>
<ul>
  <li>✅ Site ou app <strong>Meu INSS</strong> (meu.inss.gov.br)</li>
  <li>✅ Telefone gratuito: <strong>135</strong> (2ª a sábado, 7h às 22h)</li>
  <li>✅ Agendar atendimento presencial na agência INSS</li>
</ul><br>
<strong>📄 Documentos necessários:</strong> RG, CPF, carteiras de trabalho, contracheques, comprovante de residência.`,
    chips: ['Bolsa Família', 'Saúde Pública', 'Direitos Trabalhistas'],
    sources: ['meu.inss.gov.br', 'Telefone 135']
  },
  bolsa: {
    title: '💚 Bolsa Família',
    text: `<strong>📋 O que é o Bolsa Família?</strong><br><br>
Programa de transferência de renda para famílias em situação de pobreza e extrema pobreza. Desde 2023, com valores atualizados.<br><br>
<strong>💰 Valores (2024-2025):</strong><br>
<ul>
  <li>🔸 <strong>Benefício mínimo:</strong> R$ 600 por família</li>
  <li>🔸 <strong>Adicional por criança (0-6 anos):</strong> R$ 150</li>
  <li>🔸 <strong>Adicional por jovem (7-18 anos):</strong> R$ 50</li>
  <li>🔸 <strong>Adicional gestante:</strong> R$ 50</li>
</ul><br>
<strong>✅ Quem tem direito:</strong><br>
<ul>
  <li>🔸 Renda per capita familiar de até <strong>R$ 218/mês</strong></li>
  <li>🔸 Estar inscrito no <strong>CadÚnico</strong></li>
  <li>🔸 Manter vacinação e frequência escolar das crianças em dia</li>
</ul><br>
<strong>📍 Como se inscrever:</strong> Procure o <strong>CRAS</strong> mais próximo com RG, CPF, comprovante de residência e certidões de nascimento dos filhos.`,
    chips: ['INSS', 'Educação', 'Habitação'],
    sources: ['CRAS', 'cidadania.gov.br']
  },
  saude: {
    title: '🏥 Saúde Pública (SUS)',
    text: `<strong>📋 Seus direitos no SUS:</strong><br><br>
<ul>
  <li>🔸 <strong>Atendimento universal:</strong> Qualquer pessoa tem direito ao SUS, brasileiro ou não</li>
  <li>🔸 <strong>UBS (Posto de Saúde):</strong> Consultas, vacinas, exames básicos, curativos, pré-natal</li>
  <li>🔸 <strong>UPA 24h:</strong> Urgências e emergências</li>
  <li>🔸 <strong>Farmácia Popular:</strong> Medicamentos com até 90% de desconto ou grátis</li>
  <li>🔸 <strong>SAMU 192:</strong> Ambulância gratuita para emergências</li>
</ul><br>
<strong>💊 Medicamentos gratuitos incluem:</strong> Hipertensão, diabetes, asma, anticoncepcionais, e muitos outros.<br><br>
<strong>📞 Telefones importantes:</strong><br>
<ul>
  <li>✅ <strong>SAMU: 192</strong> (emergências)</li>
  <li>✅ <strong>Disque Saúde: 136</strong> (ouvidoria e informações)</li>
</ul>`,
    chips: ['INSS', 'Bolsa Família', 'Direitos do Idoso'],
    sources: ['gov.br/saude', 'Telefone 136']
  },
  trabalho: {
    title: '⚖️ Direitos Trabalhistas',
    text: `<strong>📋 Seus principais direitos (CLT):</strong><br><br>
<ul>
  <li>🔸 <strong>Carteira assinada</strong> obrigatória desde o 1º dia</li>
  <li>🔸 <strong>Salário mínimo:</strong> R$ 1.412 (2024) — nenhum salário pode ser menor</li>
  <li>🔸 <strong>13º salário:</strong> 1ª parcela até 30/Nov, 2ª parcela até 20/Dez</li>
  <li>🔸 <strong>Férias:</strong> 30 dias após 12 meses + 1/3 constitucional</li>
  <li>🔸 <strong>FGTS:</strong> Empregador deposita 8% do salário mensalmente</li>
  <li>🔸 <strong>Vale-transporte:</strong> Desconto máximo de 6% do salário</li>
  <li>🔸 <strong>Jornada máxima:</strong> 8h/dia, 44h/semana</li>
</ul><br>
<strong>🚨 Foi demitido sem justa causa? Você tem direito a:</strong><br>
<ul>
  <li>✅ Aviso prévio (30 dias + 3 dias/ano trabalhado)</li>
  <li>✅ Multa de 40% do FGTS</li>
  <li>✅ Saque do FGTS</li>
  <li>✅ Seguro-desemprego (3 a 5 parcelas)</li>
</ul><br>
<strong>📍 Problemas?</strong> Procure o <strong>Ministério do Trabalho</strong> ou um <strong>sindicato</strong> da sua categoria.`,
    chips: ['INSS', 'Bolsa Família', 'Documentos'],
    sources: ['Ministério do Trabalho', 'gov.br/esocial']
  },
  educacao: {
    title: '🎓 Educação & Bolsas',
    text: `<strong>📋 Programas educacionais disponíveis:</strong><br><br>
<ul>
  <li>🔸 <strong>PROUNI:</strong> Bolsas de 50% ou 100% em faculdades particulares — precisa ter feito ENEM</li>
  <li>🔸 <strong>FIES:</strong> Financiamento a juros baixos para graduação — renda familiar até 3 salários mínimos</li>
  <li>🔸 <strong>SISU:</strong> Vagas em universidades públicas usando nota do ENEM</li>
  <li>🔸 <strong>EJA:</strong> Educação de Jovens e Adultos — gratuito para quem não completou o ensino fundamental/médio</li>
  <li>🔸 <strong>ENCCEJA:</strong> Prova para certificação de ensino fundamental e médio (gratuito)</li>
  <li>🔸 <strong>Cursos gratuitos:</strong> SENAI, SENAC, SESC e Escolas Técnicas Estaduais</li>
</ul><br>
<strong>📅 Fique atento às datas do ENEM e das inscrições!</strong>`,
    chips: ['Bolsa Família', 'Documentos', 'Trabalho'],
    sources: ['sisu.mec.gov.br', 'prouniportal.mec.gov.br']
  },
  habitacao: {
    title: '🏘️ Habitação & Moradia',
    text: `<strong>📋 Programas e direitos de moradia:</strong><br><br>
<ul>
  <li>🔸 <strong>Minha Casa Minha Vida:</strong> Financiamento de imóveis com subsídios do governo — renda até R$ 8.000/mês</li>
  <li>🔸 <strong>FAIXA 1:</strong> Renda até R$ 2.640 — maior subsídio, parcelas a partir de R$ 80</li>
  <li>🔸 <strong>Aluguel Social:</strong> Auxílio para famílias em situação de vulnerabilidade — procure o CRAS</li>
</ul><br>
<strong>🔒 Direitos do inquilino:</strong><br>
<ul>
  <li>✅ O proprietário <strong>não pode</strong> despejar sem aviso prévio de 30 dias</li>
  <li>✅ Reajuste anual limitado ao índice do contrato (geralmente IGPM ou IPCA)</li>
  <li>✅ Direito a recibo de pagamento</li>
</ul><br>
<strong>📍 Inscrição:</strong> Cadastro nas prefeituras ou Caixa Econômica Federal.`,
    chips: ['Bolsa Família', 'Documentos', 'Trabalho'],
    sources: ['Caixa Econômica Federal', 'gov.br/habitacao']
  },
  documentos: {
    title: '📑 Documentos & Registros',
    text: `<strong>📋 Documentos essenciais e como obter:</strong><br><br>
<ul>
  <li>🔸 <strong>CPF:</strong> Gratuito via <a href="https://www.gov.br" target="_blank">Gov.br</a>, Correios (R$ 7+) ou Receita Federal</li>
  <li>🔸 <strong>RG (Carteira de Identidade Nacional - CIN):</strong> Novo modelo unificado — emitido em postos do IIRGD/DETRAN. 1ª via gratuita</li>
  <li>🔸 <strong>Título de Eleitor:</strong> Obrigatório dos 18 aos 70 anos — emitir pelo <a href="https://www.tse.jus.br/eleitor/titulo-de-eleitor" target="_blank">TSE</a></li>
  <li>🔸 <strong>Certidão de Nascimento:</strong> 1ª via gratuita em cartório — necessária para tudo</li>
  <li>🔸 <strong>Carteira de Trabalho Digital:</strong> Pelo app CTPS Digital ou site do governo</li>
  <li>🔸 <strong>Gov.br:</strong> Cadastro único para serviços digitais do governo federal</li>
</ul><br>
<strong>💡 Dica:</strong> Com conta <strong>Gov.br nível Ouro</strong>, você acessa quase todos os serviços sem sair de casa!`,
    chips: ['INSS', 'Trabalho', 'Educação'],
    sources: ['gov.br', 'Receita Federal']
  },
  idoso: {
    title: '👴 Direitos do Idoso',
    text: `<strong>📋 Estatuto do Idoso — Direitos garantidos (60+ anos):</strong><br><br>
<ul>
  <li>🔸 <strong>Transporte público gratuito:</strong> A partir de <strong>65 anos</strong> — ônibus urbanos gratuitos</li>
  <li>🔸 <strong>Meia-entrada:</strong> Em eventos culturais, esportivos e de lazer</li>
  <li>🔸 <strong>Atendimento prioritário:</strong> Bancos, hospitais, supermercados e órgãos públicos</li>
  <li>🔸 <strong>Prioridade na fila do SUS:</strong> Atendimento preferencial em todas as unidades</li>
  <li>🔸 <strong>BPC/LOAS:</strong> R$ 1.412/mês para idosos 65+ com renda familiar per capita inferior a 1/4 do salário mínimo</li>
  <li>🔸 <strong>Isenção de IPTU:</strong> Em muitos municípios — consulte a prefeitura</li>
  <li>🔸 <strong>Desconto em medicamentos:</strong> Farmácia Popular e programas municipais</li>
</ul><br>
<strong>📞 Denuncie maus-tratos:</strong> <strong>Disque 100</strong> (Disque Direitos Humanos — 24h, gratuito)`,
    chips: ['INSS', 'Saúde Pública', 'Documentos'],
    sources: ['Disque 100', 'Estatuto do Idoso - Lei 10.741/2003']
  }
};

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let conversationHistory = [];
let currentFontSize = parseInt(localStorage.getItem('vp_fontSize') || '100');
let isHighContrast = localStorage.getItem('vp_contrast') === 'true';
let isLightMode = localStorage.getItem('vp_theme') === 'light';
let autoTTS = localStorage.getItem('vp_autoTTS') === 'true';
let metrics = JSON.parse(localStorage.getItem('vp_metrics') || '{"queries":0,"topics":[],"docs":0}');
let uploadedFile = null;

// ══════════════════════════════════════════════
// DOM REFERENCES
// ══════════════════════════════════════════════
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');
const a11yPanel = document.getElementById('a11yPanel');
const accessibilityToggle = document.getElementById('accessibilityToggle');
const fontSizeLabel = document.getElementById('fontSizeLabel');
const contrastToggle = document.getElementById('contrastToggle');
const ttsToggle = document.getElementById('ttsToggle');
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const settingsClose = document.getElementById('settingsClose');
const docAnalyzer = document.getElementById('docAnalyzer');
const dropZone = document.getElementById('dropZone');
const docFileInput = document.getElementById('docFileInput');
const docPreview = document.getElementById('docPreview');
const docPreviewImg = document.getElementById('docPreviewImg');
const aiStatusText = document.getElementById('aiStatusText');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const guideModal = document.getElementById('guideModal');
const guideBtn = document.getElementById('guideBtn');
const guideClose = document.getElementById('guideClose');
const topicSearchInput = document.getElementById('topicSearchInput');
const topicBtns = document.querySelectorAll('#topicGroupList .topic-btn');

// ══════════════════════════════════════════════
// INTENT DETECTION — Local KB fallback
// ══════════════════════════════════════════════
function detectIntent(message) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const intentMap = {
    inss: ['inss', 'aposentadoria', 'aposentar', 'previdencia', 'contribui', 'contribuicao', 'pensao', 'auxilio-doenca', 'auxilio doenca', 'bpc', 'beneficio'],
    bolsa: ['bolsa familia', 'bolsa-familia', 'cadunico', 'cras', 'transferencia de renda', 'auxilio brasil', 'pobreza'],
    saude: ['sus', 'saude', 'hospital', 'ubs', 'posto de saude', 'medico', 'remedio', 'medicamento', 'farmacia popular', 'vacina', 'samu', 'upa'],
    trabalho: ['trabalho', 'trabalhista', 'clt', 'ferias', 'fgts', '13 salario', 'decimo terceiro', 'demitido', 'demissao', 'rescisao', 'seguro desemprego', 'carteira assinada', 'hora extra'],
    educacao: ['educacao', 'prouni', 'fies', 'sisu', 'enem', 'eja', 'encceja', 'faculdade', 'universidade', 'bolsa de estudo', 'curso gratuito', 'escola', 'senai', 'senac'],
    habitacao: ['habitacao', 'moradia', 'casa', 'minha casa', 'aluguel', 'despejo', 'inquilino', 'financiamento', 'imovel'],
    documentos: ['cpf', 'rg', 'documento', 'certidao', 'titulo', 'carteira de trabalho', 'ctps', 'identidade', 'registro'],
    idoso: ['idoso', 'velho', 'terceira idade', 'aposentado', 'estatuto do idoso', 'transporte gratuito', 'meia entrada', 'loas', '65 anos', '60 anos']
  };

  for (const [intent, keywords] of Object.entries(intentMap)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return KB[intent];
    }
  }
  return null;
}

function getGreetingResponse() {
  return {
    text: `<strong>Olá! 👋 Que bom te ver por aqui!</strong><br><br>
Sou o <strong>VozPública</strong>, seu assistente virtual de direitos e serviços públicos brasileiros. Posso te ajudar com:<br><br>
<ul>
  <li>🏛️ <strong>INSS e Aposentadoria</strong></li>
  <li>💚 <strong>Bolsa Família e benefícios sociais</strong></li>
  <li>🏥 <strong>Saúde Pública (SUS)</strong></li>
  <li>⚖️ <strong>Direitos trabalhistas</strong></li>
  <li>🎓 <strong>Educação e bolsas de estudo</strong></li>
  <li>🏘️ <strong>Habitação e moradia</strong></li>
  <li>📑 <strong>Documentos e registros</strong></li>
  <li>👴 <strong>Direitos do idoso</strong></li>
</ul><br>
É só perguntar! Pode digitar ou falar normalmente, como se estivesse conversando com um amigo. 😊`,
    chips: ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho']
  };
}

function getFallbackResponse() {
  return {
    text: `Desculpe, não consegui encontrar informações específicas sobre isso na minha base local. 😔<br><br>
<strong>💡 Sugestões:</strong><br>
<ul>
  <li>🔸 Tente reformular sua pergunta com palavras mais simples</li>
  <li>🔸 Use os botões de categorias na lateral esquerda</li>
  <li>🔸 Configure uma chave do <strong>Gemini AI</strong> em ⚙️ Config para respostas ilimitadas</li>
</ul><br>
<strong>📞 Se precisar de ajuda urgente:</strong><br>
• Disque <strong>135</strong> (INSS) · <strong>136</strong> (Saúde) · <strong>100</strong> (Direitos Humanos)`,
    chips: ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho']
  };
}

// ══════════════════════════════════════════════
// MESSAGE RENDERING
// ══════════════════════════════════════════════
function renderMessage(type, content, chips = [], sources = []) {
  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (docAnalyzer) docAnalyzer.style.display = 'none';

  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.setAttribute('role', 'article');
  msg.setAttribute('aria-label', type === 'ai' ? 'Resposta do VozPública' : 'Sua mensagem');

  const avatar = type === 'ai' ? '📢' : '👤';
  const name = type === 'ai' ? 'VozPública' : 'Você';

  let chipsHTML = '';
  if (chips && chips.length > 0) {
    chipsHTML = `<div class="msg-chips">${chips.map(c =>
      `<button class="msg-chip" onclick="handleChipClick('${c}')">${c}</button>`
    ).join('')}</div>`;
  }

  let sourcesHTML = '';
  if (sources && sources.length > 0) {
    sourcesHTML = `<div class="msg-sources"><span class="source-label">📎 Fontes:</span> ${sources.join(' · ')}</div>`;
  }

  let ttsBtn = '';
  if (type === 'ai') {
    ttsBtn = `<button class="msg-tts-btn" onclick="speakMessage(this)" title="Ouvir resposta" aria-label="Ouvir resposta em áudio">
      <span class="tts-icon">🔊</span>
      <span class="tts-wave" style="display:none">
        <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
      </span>
    </button>`;
  }

  msg.innerHTML = `
    <div class="msg-avatar ${type}" aria-hidden="true">${avatar}</div>
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-name">${name}</span>
        <span class="msg-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        ${ttsBtn}
      </div>
      <div class="msg-content">${content}</div>
      ${sourcesHTML}
      ${chipsHTML}
    </div>
  `;

  chatMessages.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'end' });

  // Auto-TTS if enabled
  if (type === 'ai' && autoTTS) {
    setTimeout(() => speakMessage(msg.querySelector('.msg-tts-btn')), 600);
  }

  return msg;
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message ai typing-msg';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="msg-avatar ai" aria-hidden="true">📢</div>
    <div class="msg-body">
      <div class="typing-indicator" aria-label="VozPública está digitando">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(typing);
  typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function removeTypingIndicator() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

// ══════════════════════════════════════════════
// MESSAGE PROCESSING — Gemini AI with local fallback
// ══════════════════════════════════════════════
async function processMessage(userText) {
  if (!userText.trim()) return;

  // Show user message
  renderMessage('user', escapeHTML(userText));
  conversationHistory.push({ role: 'user', text: userText });

  // Update metrics
  metrics.queries++;
  saveMetrics();

  // Show typing
  showTypingIndicator();

  // Greetings
  const lower = userText.toLowerCase();
  if (['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'salve'].some(g => lower.includes(g)) && userText.length < 30) {
    await delay(800);
    removeTypingIndicator();
    const greeting = getGreetingResponse();
    renderMessage('ai', greeting.text, greeting.chips);
    conversationHistory.push({ role: 'model', text: greeting.text });
    return;
  }

  // Try Gemini AI first
  if (AI.hasGeminiKey()) {
    try {
      const aiResponse = await AI.chat(userText, conversationHistory);
      if (aiResponse) {
        removeTypingIndicator();
        renderMessage('ai', aiResponse, ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho']);
        conversationHistory.push({ role: 'model', text: aiResponse });
        return;
      }
    } catch (err) {
      console.warn('Gemini failed, falling back to local KB:', err);
    }
  }

  // Fallback to local knowledge base
  await delay(1200 + Math.random() * 800);
  removeTypingIndicator();

  const kbResult = detectIntent(userText);
  if (kbResult) {
    if (!metrics.topics.includes(kbResult.title)) {
      metrics.topics.push(kbResult.title);
      saveMetrics();
    }
    renderMessage('ai', kbResult.text, kbResult.chips, kbResult.sources);
    conversationHistory.push({ role: 'model', text: kbResult.text });
  } else {
    const fallback = getFallbackResponse();
    renderMessage('ai', fallback.text, fallback.chips);
    conversationHistory.push({ role: 'model', text: fallback.text });
  }
}

// ══════════════════════════════════════════════
// TTS — ElevenLabs + Browser fallback
// ══════════════════════════════════════════════
async function speakMessage(btn) {
  if (!btn) return;
  const msgContent = btn.closest('.msg-body').querySelector('.msg-content');
  if (!msgContent) return;

  const icon = btn.querySelector('.tts-icon');
  const wave = btn.querySelector('.tts-wave');

  if (AI.isSpeaking()) {
    AI.stopSpeaking();
    if (icon) icon.style.display = '';
    if (wave) wave.style.display = 'none';
    return;
  }

  if (icon) icon.style.display = 'none';
  if (wave) wave.style.display = 'flex';

  document.addEventListener('tts-ended', () => {
    if (icon) icon.style.display = '';
    if (wave) wave.style.display = 'none';
  }, { once: true });

  await AI.speak(msgContent.textContent);
}

// ══════════════════════════════════════════════
// DOCUMENT ANALYZER
// ══════════════════════════════════════════════
function toggleDocAnalyzer() {
  const isVisible = docAnalyzer.style.display !== 'none';
  if (isVisible) {
    docAnalyzer.style.display = 'none';
  } else {
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    docAnalyzer.style.display = 'block';
    docAnalyzer.scrollIntoView({ behavior: 'smooth' });
  }
}

async function analyzeUploadedDoc() {
  if (!uploadedFile) return;

  docAnalyzer.style.display = 'none';
  renderMessage('user', `📄 Analisando documento: ${uploadedFile.name}`);
  showTypingIndicator();

  const result = await DocAnalyzer.analyze(uploadedFile);
  removeTypingIndicator();

  if (result.success) {
    metrics.docs++;
    saveMetrics();
    renderMessage('ai', result.analysis, ['INSS', 'Documentos', 'Trabalho']);
  } else {
    renderMessage('ai', `⚠️ ${result.error}<br><br>
<strong>💡 Dicas:</strong><br>
<ul>
  <li>Tire uma foto mais clara e bem iluminada do documento</li>
  <li>Certifique-se que todo o texto está legível</li>
  <li>Configure sua chave do Gemini AI em ⚙️ Config</li>
</ul>`);
  }

  uploadedFile = null;
  docPreview.style.display = 'none';
  dropZone.style.display = '';
}

// ══════════════════════════════════════════════
// TOPIC QUICK START
// ══════════════════════════════════════════════
function startTopic(topicKey) {
  const topic = KB[topicKey];
  if (!topic) return;

  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (docAnalyzer) docAnalyzer.style.display = 'none';

  if (!metrics.topics.includes(topic.title)) {
    metrics.topics.push(topic.title);
    saveMetrics();
  }

  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    renderMessage('ai', topic.text, topic.chips, topic.sources);
    conversationHistory.push({ role: 'model', text: topic.text });
  }, 600);
}

function handleChipClick(chipText) {
  const chipMap = {
    'INSS': 'inss', 'Bolsa Família': 'bolsa', 'Saúde': 'saude', 'Saúde Pública': 'saude',
    'Trabalho': 'trabalho', 'Direitos Trabalhistas': 'trabalho', 'Educação': 'educacao',
    'Habitação': 'habitacao', 'Documentos': 'documentos', 'Direitos do Idoso': 'idoso'
  };
  const topicKey = chipMap[chipText];
  if (topicKey) {
    startTopic(topicKey);
  } else {
    messageInput.value = chipText;
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

// ══════════════════════════════════════════════
// METRICS
// ══════════════════════════════════════════════
function saveMetrics() {
  localStorage.setItem('vp_metrics', JSON.stringify(metrics));
  updateDashboard();
}

function updateDashboard() {
  const q = document.getElementById('totalQueries');
  const t = document.getElementById('topicsExplored');
  const d = document.getElementById('docsAnalyzed');
  if (q) q.textContent = metrics.queries;
  if (t) t.textContent = metrics.topics.length;
  if (d) d.textContent = metrics.docs;
}

// ══════════════════════════════════════════════
// ACCESSIBILITY
// ══════════════════════════════════════════════
function applyFontSize() {
  document.documentElement.style.fontSize = currentFontSize + '%';
  if (fontSizeLabel) fontSizeLabel.textContent = currentFontSize + '%';
  localStorage.setItem('vp_fontSize', currentFontSize);
}

function applyContrast() {
  document.body.classList.toggle('high-contrast', isHighContrast);
  if (contrastToggle) contrastToggle.setAttribute('aria-checked', isHighContrast);
  localStorage.setItem('vp_contrast', isHighContrast);
}

function applyTheme() {
  document.body.classList.toggle('light-mode', isLightMode);
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('.theme-icon');
    if (icon) icon.textContent = isLightMode ? '☀️' : '🌙';
  }
}

// ══════════════════════════════════════════════
// SETTINGS MODAL
// ══════════════════════════════════════════════
function updateAPIStatus() {
  const gs = document.getElementById('geminiStatus');
  const es = document.getElementById('elevenLabsStatus');
  if (gs) gs.textContent = AI.hasGeminiKey() ? '✅ Conectado — IA Gemini ativa' : '❌ Não configurado — usando base local';
  if (es) es.textContent = AI.hasElevenLabsKey() ? '✅ Conectado — Voz ElevenLabs ativa' : '❌ Não configurado — usando voz do navegador';
  if (aiStatusText) {
    if (AI.hasGeminiKey()) {
      aiStatusText.textContent = 'Gemini AI';
      document.getElementById('aiStatus')?.classList.add('ai-active');
    } else {
      aiStatusText.textContent = 'Base Local';
      document.getElementById('aiStatus')?.classList.remove('ai-active');
    }
  }
}

// ══════════════════════════════════════════════
// VOICE INPUT
// ══════════════════════════════════════════════
function setupVoiceInput() {
  const voiceBtn = document.getElementById('voiceMsgBtn');
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;
  let listening = false;

  voiceBtn.addEventListener('click', () => {
    if (listening) {
      recognition.stop();
      return;
    }
    recognition.start();
    listening = true;
    voiceBtn.classList.add('voice-active');
    voiceBtn.textContent = '🔴';
  });

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    messageInput.value = transcript;
    sendBtn.disabled = false;
    processMessage(transcript);
  };

  recognition.onend = () => {
    listening = false;
    voiceBtn.classList.remove('voice-active');
    voiceBtn.textContent = '🎤';
  };

  recognition.onerror = () => {
    listening = false;
    voiceBtn.classList.remove('voice-active');
    voiceBtn.textContent = '🎤';
  };
}

// ══════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHTML(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function setLanguage(mode) { /* placeholder for future modes */ }

// ══════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Input handling
  messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim();
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  });

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.value.trim()) {
        processMessage(messageInput.value.trim());
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;
      }
    }
  });

  sendBtn.addEventListener('click', () => {
    if (messageInput.value.trim()) {
      processMessage(messageInput.value.trim());
      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendBtn.disabled = true;
    }
  });

  // New chat
  newChatBtn.addEventListener('click', () => {
    conversationHistory = [];
    chatMessages.innerHTML = '';
    if (welcomeScreen) {
      chatMessages.appendChild(welcomeScreen);
      welcomeScreen.style.display = '';
    }
    messageInput.value = '';
    sendBtn.disabled = true;
  });

  // Accessibility panel
  accessibilityToggle.addEventListener('click', () => {
    const isOpen = a11yPanel.getAttribute('aria-hidden') === 'false';
    a11yPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    accessibilityToggle.setAttribute('aria-expanded', !isOpen);
  });

  document.getElementById('fontIncrease').addEventListener('click', () => {
    if (currentFontSize < 150) { currentFontSize += 10; applyFontSize(); }
  });
  document.getElementById('fontDecrease').addEventListener('click', () => {
    if (currentFontSize > 70) { currentFontSize -= 10; applyFontSize(); }
  });

  contrastToggle.addEventListener('click', () => {
    isHighContrast = !isHighContrast;
    applyContrast();
  });

  ttsToggle.addEventListener('click', () => {
    autoTTS = !autoTTS;
    ttsToggle.setAttribute('aria-checked', autoTTS);
    localStorage.setItem('vp_autoTTS', autoTTS);
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isLightMode = !isLightMode;
      localStorage.setItem('vp_theme', isLightMode ? 'light' : 'dark');
      applyTheme();
    });
  }

  // Settings modal
  settingsBtn.addEventListener('click', () => {
    settingsModal.setAttribute('aria-hidden', 'false');
    settingsModal.style.display = 'flex';
    const gInput = document.getElementById('geminiKeyInput');
    const eInput = document.getElementById('elevenLabsKeyInput');
    if (AI.hasGeminiKey()) gInput.value = '••••••••••••';
    if (AI.hasElevenLabsKey()) eInput.value = '••••••••••••';
    updateAPIStatus();
  });

  settingsClose.addEventListener('click', () => {
    settingsModal.setAttribute('aria-hidden', 'true');
    settingsModal.style.display = 'none';
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.setAttribute('aria-hidden', 'true');
      settingsModal.style.display = 'none';
    }
  });

  document.getElementById('saveGeminiKey').addEventListener('click', () => {
    const val = document.getElementById('geminiKeyInput').value.trim();
    if (val && !val.startsWith('••')) { AI.setGeminiKey(val); }
    updateAPIStatus();
  });

  document.getElementById('saveElevenLabsKey').addEventListener('click', () => {
    const val = document.getElementById('elevenLabsKeyInput').value.trim();
    if (val && !val.startsWith('••')) { AI.setElevenLabsKey(val); }
    updateAPIStatus();
  });

  // User Guide Modal
  if (guideBtn && guideModal && guideClose) {
    guideBtn.addEventListener('click', () => {
      guideModal.setAttribute('aria-hidden', 'false');
      guideModal.style.display = 'flex';
    });
    guideClose.addEventListener('click', () => {
      guideModal.setAttribute('aria-hidden', 'true');
      guideModal.style.display = 'none';
    });
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) {
        guideModal.setAttribute('aria-hidden', 'true');
        guideModal.style.display = 'none';
      }
    });
  }

  // Topic Search & Shortcut
  if (topicSearchInput) {
    topicSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      topicBtns.forEach(btn => {
        const text = btn.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (text.includes(query)) {
          btn.style.display = 'flex';
        } else {
          btn.style.display = 'none';
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        topicSearchInput.focus();
      }
    });
  }

  // Document upload
  dropZone.addEventListener('click', () => docFileInput.click());
  dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter') docFileInput.click(); });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-active');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-active');
    if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files[0]);
  });

  docFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileUpload(e.target.files[0]);
  });

  // Apply saved settings
  applyFontSize();
  applyContrast();
  applyTheme();
  if (autoTTS) ttsToggle.setAttribute('aria-checked', 'true');
  updateDashboard();
  updateAPIStatus();
  setupVoiceInput();
});

async function handleFileUpload(file) {
  const validation = DocAnalyzer.validateFile(file);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  uploadedFile = file;
  const preview = await DocAnalyzer.createPreview(file);
  if (preview) {
    docPreviewImg.src = preview;
    docPreview.style.display = 'block';
    dropZone.style.display = 'none';
  } else {
    // PDF or non-image — just show name
    docPreviewImg.src = '';
    docPreview.style.display = 'block';
    dropZone.style.display = 'none';
    docPreviewImg.alt = `Arquivo selecionado: ${file.name}`;
  }
}
