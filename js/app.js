/* ==========================================
   VozPública — App Engine v2 (app.js)
   + Histórico persistente
   + Integração geolocalização
   + CEP automático via ViaCEP
   + Dashboard com gráficos de tópicos
   ========================================== */

'use strict';

// ══════════════════════════════════════════════
const KB = {
  inss: {
    title: '🏛️ INSS & Aposentadoria',
    text: `<strong>📋 Tipos de Aposentadoria (após Reforma 2019):</strong><br><br>
<ul>
  <li>🔸 <strong>Por idade:</strong> Mulher 62 anos + 15 anos contribuição | Homem 65 anos + 20 anos contribuição</li>
  <li>🔸 <strong>Especial:</strong> Para quem trabalhou exposto a agentes nocivos (15/20/25 anos)</li>
  <li>🔸 <strong>Por invalidez:</strong> Quando há incapacidade permanente para o trabalho</li>
  <li>🔸 <strong>Rural:</strong> Mulher 55 anos | Homem 60 anos + comprovação de atividade rural</li>
</ul><br>
<strong>📞 Como solicitar:</strong><br>
<ul>
  <li>✅ Site ou app <strong>Meu INSS</strong> (meu.inss.gov.br)</li>
  <li>✅ Telefone gratuito: <strong>135</strong> (2ª a sábado, 7h–22h)</li>
  <li>✅ Agência INSS presencialmente</li>
</ul><br>
<strong>📄 Documentos:</strong> RG, CPF, carteiras de trabalho, contracheques, comprovante de residência.`,
    chips: ['Bolsa Família', 'Saúde Pública', 'Direitos Trabalhistas'],
    sources: ['meu.inss.gov.br', 'Telefone 135']
  },
  bolsa: {
    title: '💚 Bolsa Família',
    text: `<strong>📋 O que é o Bolsa Família?</strong><br><br>
Transferência de renda para famílias em situação de pobreza e extrema pobreza.<br><br>
<strong>💰 Valores (2024–2025):</strong><br>
<ul>
  <li>🔸 <strong>Benefício mínimo:</strong> R$ 600 por família</li>
  <li>🔸 <strong>Adicional criança (0–6 anos):</strong> R$ 150</li>
  <li>🔸 <strong>Adicional jovem (7–18 anos):</strong> R$ 50</li>
  <li>🔸 <strong>Adicional gestante:</strong> R$ 50</li>
</ul><br>
<strong>✅ Quem tem direito:</strong><br>
<ul>
  <li>🔸 Renda per capita familiar de até <strong>R$ 218/mês</strong></li>
  <li>🔸 Estar inscrito no <strong>CadÚnico</strong></li>
  <li>🔸 Manter vacinação e frequência escolar das crianças</li>
</ul><br>
<strong>📍 Como se inscrever:</strong> Procure o <strong>CRAS</strong> mais próximo com RG, CPF, comprovante de residência e certidões de nascimento dos filhos.`,
    chips: ['INSS', 'Educação', 'Habitação'],
    sources: ['CRAS', 'cidadania.gov.br']
  },
  saude: {
    title: '🏥 Saúde Pública (SUS)',
    text: `<strong>📋 Seus direitos no SUS:</strong><br><br>
<ul>
  <li>🔸 <strong>Atendimento universal:</strong> Qualquer pessoa tem direito ao SUS</li>
  <li>🔸 <strong>UBS (Posto de Saúde):</strong> Consultas, vacinas, exames básicos, pré-natal</li>
  <li>🔸 <strong>UPA 24h:</strong> Urgências e emergências</li>
  <li>🔸 <strong>Farmácia Popular:</strong> Medicamentos com até 90% de desconto ou grátis</li>
  <li>🔸 <strong>SAMU 192:</strong> Ambulância gratuita para emergências</li>
</ul><br>
<strong>💊 Medicamentos gratuitos incluem:</strong> Hipertensão, diabetes, asma, anticoncepcionais e muitos outros.<br><br>
<strong>📞 Telefones:</strong><br>
<ul>
  <li>✅ <strong>SAMU: 192</strong></li>
  <li>✅ <strong>Disque Saúde: 136</strong></li>
</ul>`,
    chips: ['INSS', 'Bolsa Família', 'Direitos do Idoso'],
    sources: ['gov.br/saude', 'Telefone 136']
  },
  trabalho: {
    title: '⚖️ Direitos Trabalhistas',
    text: `<strong>📋 Seus principais direitos (CLT):</strong><br><br>
<ul>
  <li>🔸 <strong>Carteira assinada</strong> obrigatória desde o 1º dia</li>
  <li>🔸 <strong>Salário mínimo:</strong> R$ 1.412 (2024)</li>
  <li>🔸 <strong>13º salário</strong> · <strong>Férias:</strong> 30 dias + 1/3 constitucional</li>
  <li>🔸 <strong>FGTS:</strong> 8% do salário mensalmente</li>
  <li>🔸 <strong>Jornada máxima:</strong> 8h/dia, 44h/semana</li>
</ul><br>
<strong>🚨 Demitido sem justa causa? Você tem direito a:</strong><br>
<ul>
  <li>✅ Aviso prévio (30 dias + 3 dias/ano)</li>
  <li>✅ Multa de 40% do FGTS</li>
  <li>✅ Saque do FGTS</li>
  <li>✅ Seguro-desemprego (3 a 5 parcelas)</li>
</ul><br>
<strong>📍 Problemas?</strong> Procure o <strong>Ministério do Trabalho</strong> ou seu <strong>sindicato</strong>.`,
    chips: ['INSS', 'Bolsa Família', 'Documentos'],
    sources: ['Ministério do Trabalho', 'gov.br/esocial']
  },
  educacao: {
    title: '🎓 Educação & Bolsas',
    text: `<strong>📋 Programas disponíveis:</strong><br><br>
<ul>
  <li>🔸 <strong>PROUNI:</strong> Bolsas de 50% ou 100% em faculdades particulares</li>
  <li>🔸 <strong>FIES:</strong> Financiamento com juros baixos — renda até 3 salários mínimos</li>
  <li>🔸 <strong>SISU:</strong> Vagas em universidades públicas com nota do ENEM</li>
  <li>🔸 <strong>EJA:</strong> Gratuito para quem não completou fundamental/médio</li>
  <li>🔸 <strong>ENCCEJA:</strong> Certificação de ensino fundamental e médio (gratuito)</li>
  <li>🔸 <strong>Cursos gratuitos:</strong> SENAI, SENAC, SESC e Escolas Técnicas</li>
</ul><br>
<strong>📅 Fique atento às datas do ENEM e inscrições!</strong>`,
    chips: ['Bolsa Família', 'Documentos', 'Trabalho'],
    sources: ['sisu.mec.gov.br', 'prouniportal.mec.gov.br']
  },
  habitacao: {
    title: '🏘️ Habitação & Moradia',
    text: `<strong>📋 Programas e direitos:</strong><br><br>
<ul>
  <li>🔸 <strong>Minha Casa Minha Vida:</strong> Financiamento com subsídios — renda até R$ 8.000/mês</li>
  <li>🔸 <strong>FAIXA 1:</strong> Renda até R$ 2.640 — maior subsídio, parcelas a partir de R$ 80</li>
  <li>🔸 <strong>Aluguel Social:</strong> Auxílio para famílias vulneráveis — procure o CRAS</li>
</ul><br>
<strong>🔒 Direitos do inquílino:</strong><br>
<ul>
  <li>✅ Não pode ser despejado sem aviso prévio de 30 dias</li>
  <li>✅ Reajuste anual limitado ao índice do contrato (IGPM ou IPCA)</li>
  <li>✅ Direito a recibo de pagamento</li>
</ul>`,
    chips: ['Bolsa Família', 'Documentos', 'Trabalho'],
    sources: ['Caixa Econômica Federal', 'gov.br/habitacao']
  },
  documentos: {
    title: '📑 Documentos & Registros',
    text: `<strong>📋 Documentos essenciais e como obter:</strong><br><br>
<ul>
  <li>🔸 <strong>CPF:</strong> Grátis via <a href="https://www.gov.br" target="_blank">Gov.br</a>, Correios ou Receita Federal</li>
  <li>🔸 <strong>RG (CIN):</strong> Novo modelo unificado — 1ª via gratuita em postos do IIRGD/DETRAN</li>
  <li>🔸 <strong>Título de Eleitor:</strong> Obrigatório dos 18 aos 70 anos — <a href="https://www.tse.jus.br" target="_blank">TSE</a></li>
  <li>🔸 <strong>Certidão de Nascimento:</strong> 1ª via gratuita em cartório</li>
  <li>🔸 <strong>CTPS Digital:</strong> Pelo app ou site do governo</li>
  <li>🔸 <strong>Gov.br:</strong> Conta única para serviços digitais federais</li>
</ul><br>
<strong>💡 Dica:</strong> Com conta <strong>Gov.br nível Ouro</strong>, você acessa quase tudo sem sair de casa!`,
    chips: ['INSS', 'Trabalho', 'Educação'],
    sources: ['gov.br', 'Receita Federal']
  },
  idoso: {
    title: '👴 Direitos do Idoso',
    text: `<strong>📋 Estatuto do Idoso — Direitos (60+ anos):</strong><br><br>
<ul>
  <li>🔸 <strong>Transporte público gratuito:</strong> A partir dos <strong>65 anos</strong></li>
  <li>🔸 <strong>Meia-entrada:</strong> Em eventos culturais, esportivos e de lazer</li>
  <li>🔸 <strong>Atendimento prioritário:</strong> Bancos, hospitais, supermercados e órgãos públicos</li>
  <li>🔸 <strong>BPC/LOAS:</strong> R$ 1.412/mês para 65+ com renda per capita &lt; 1/4 do salário mínimo</li>
  <li>🔸 <strong>Isenção de IPTU:</strong> Em muitos municípios — consulte a prefeitura</li>
  <li>🔸 <strong>Desconto em medicamentos:</strong> Farmácia Popular e programas municipais</li>
</ul><br>
<strong>📞 Denûncia maus-tratos:</strong> <strong>Disque 100</strong> (24h, gratuito)`,
    chips: ['INSS', 'Saúde Pública', 'Documentos'],
    sources: ['Disque 100', 'Estatuto do Idoso — Lei 10.741/2003']
  }
};

// ══════════════════════════════════════════════
const ConversationStore = (() => {
  const KEY = 'vp_conversations_v2';
  const MAX = 25;

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  function save(conv) {
    const list = getAll();
    const idx = list.findIndex(c => c.id === conv.id);
    if (idx >= 0) { list[idx] = conv; }
    else {
      list.unshift(conv);
      if (list.length > MAX) list.splice(MAX);
    }
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {
      list.splice(MAX / 2);
      localStorage.setItem(KEY, JSON.stringify(list));
    }
  }

  function remove(id) {
    const list = getAll().filter(c => c.id !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function get(id) { return getAll().find(c => c.id === id) || null; }

  function create() {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: 'Nova conversa',
      messages: [],
      chips: [],
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function clear() { localStorage.removeItem(KEY); }

  return { getAll, save, remove, get, create, clear };
})();

// ══════════════════════════════════════════════
let conversationHistory = [];
let currentConv = null;
let currentFontSize = parseInt(localStorage.getItem('vp_fontSize') || '100');
let isHighContrast = localStorage.getItem('vp_contrast') === 'true';
let isLightMode = localStorage.getItem('vp_theme') === 'light';
let autoTTS = localStorage.getItem('vp_autoTTS') === 'true';
let metrics = JSON.parse(localStorage.getItem('vp_metrics') || '{"queries":0,"topics":{},"docs":0}');
let uploadedFile = null;
let _topicQueryCount = {};

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
const aboutModal = document.getElementById('aboutModal');
const aboutBtn = document.getElementById('aboutBtn');
const aboutClose = document.getElementById('aboutClose');
const convList = document.getElementById('convList');
const convEmpty = document.getElementById('convEmpty');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// ══════════════════════════════════════════════
function detectIntent(message) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const intentMap = {
    inss: ['inss','aposentadoria','aposentar','previdencia','contribui','contribuicao','pensao','auxilio-doenca','auxilio doenca','bpc','beneficio previdenciario'],
    bolsa: ['bolsa familia','bolsa-familia','cadunico','cras','transferencia de renda','auxilio brasil','pobreza'],
    saude: ['sus','saude','hospital','ubs','posto de saude','medico','remedio','medicamento','farmacia popular','vacina','samu','upa'],
    trabalho: ['trabalho','trabalhista','clt','ferias','fgts','13 salario','decimo terceiro','demitido','demissao','rescisao','seguro desemprego','carteira assinada','hora extra'],
    educacao: ['educacao','prouni','fies','sisu','enem','eja','encceja','faculdade','universidade','bolsa de estudo','curso gratuito','escola','senai','senac'],
    habitacao: ['habitacao','moradia','casa','minha casa','aluguel','despejo','inquilino','financiamento','imovel'],
    documentos: ['cpf','rg','documento','certidao','titulo','carteira de trabalho','ctps','identidade','registro'],
    idoso: ['idoso','velho','terceira idade','aposentado','estatuto do idoso','transporte gratuito','meia entrada','loas','65 anos','60 anos']
  };
  for (const [intent, kws] of Object.entries(intentMap)) {
    for (const kw of kws) { if (lower.includes(kw)) return { key: intent, ...KB[intent] }; }
  }
  return null;
}

function getGreetingResponse() {
  return {
    text: `<strong>Olá! 👋 Que bom te ver por aqui!</strong><br><br>
Sou o <strong>VozPública</strong>, seu assistente de direitos e serviços públicos. Posso te ajudar com:<br><br>
<ul>
  <li>🏛️ <strong>INSS e Aposentadoria</strong></li>
  <li>💚 <strong>Bolsa Família e benefícios sociais</strong></li>
  <li>🏥 <strong>Saúde Pública (SUS)</strong></li>
  <li>⚖️ <strong>Direitos trabalhistas</strong></li>
  <li>🎓 <strong>Educação e bolsas de estudo</strong></li>
  <li>🏘️ <strong>Habitação e moradia</strong></li>
  <li>📑 <strong>Documentos e registros</strong></li>
  <li>👴 <strong>Direitos do idoso</strong></li>
  <li>📍 <strong>Unidades CRAS e UBS próximas de você</strong></li>
</ul><br>
É só perguntar! Pode digitar normalmente, como conversa mesmo. 😊`,
    chips: ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho']
  };
}

function getFallbackResponse() {
  return {
    text: `Não encontrei informações específicas sobre isso na minha base local. 😔<br><br>
<strong>💡 Sugestões:</strong><br>
<ul>
  <li>🔸 Reformule com palavras mais simples</li>
  <li>🔸 Use os botões de categorias na barra lateral</li>
  <li>🔸 Configure uma chave <strong>Gemini AI</strong> em ⚙️ para respostas ilimitadas</li>
  <li>🔸 Use "📍 Perto de Mim" para localizar CRAS ou UBS</li>
</ul><br>
<strong>📞 Ajuda urgente:</strong> · <strong>135</strong> (INSS) · <strong>136</strong> (Saúde) · <strong>100</strong> (Direitos Humanos)`,
    chips: ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho']
  };
}

// ══════════════════════════════════════════════
function renderMessage(type, contentHTML, chips = [], sources = [], extraContent = '') {
  hideWelcome();

  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.setAttribute('role', 'article');

  const avatar = type === 'ai' ? '📢' : '👤';
  const name = type === 'ai' ? 'VozPública' : 'Você';

  const chipsHTML = chips.length
    ? `<div class="msg-chips">${chips.map(c =>
        `<button class="msg-chip" onclick="handleChipClick('${c}')">${c}</button>`).join('')}</div>`
    : '';

  const sourcesHTML = sources.length
    ? `<div class="msg-sources"><span class="source-label">📎 Fontes:</span> ${sources.join(' · ')}</div>`
    : '';

  const ttsBtn = type === 'ai'
    ? `<button class="msg-tts-btn" onclick="speakMessage(this)" title="Ouvir" aria-label="Ouvir resposta">
        <span class="tts-icon">🔊</span>
        <span class="tts-wave" style="display:none">
          <span class="wave-bar"></span><span class="wave-bar"></span>
          <span class="wave-bar"></span><span class="wave-bar"></span>
        </span>
       </button>` : '';

  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  msg.innerHTML = `
    <div class="msg-avatar ${type}" aria-hidden="true">${avatar}</div>
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-name">${name}</span>
        <span class="msg-time">${timeStr}</span>
        ${ttsBtn}
      </div>
      <div class="msg-content">${contentHTML}${extraContent}</div>
      ${sourcesHTML}
      ${chipsHTML}
    </div>
  `;

  chatMessages.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'end' });

  if (type === 'ai' && autoTTS) {
    setTimeout(() => speakMessage(msg.querySelector('.msg-tts-btn')), 600);
  }

  if (currentConv) {
    currentConv.messages.push({
      role: type,
      html: contentHTML + extraContent,
      text: contentHTML.replace(/<[^>]*>/g, ' '),
      time: timeStr
    });
    currentConv.updatedAt = Date.now();
    ConversationStore.save(currentConv);
    renderConversationList();
  }

  return msg;
}

function hideWelcome() {
  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (docAnalyzer) docAnalyzer.style.display = 'none';
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message ai typing-msg';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="msg-avatar ai" aria-hidden="true">📢</div>
    <div class="msg-body">
      <div class="typing-indicator" aria-label="VozPública está digitando">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>`;
  chatMessages.appendChild(typing);
  typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function removeTypingIndicator() {
  document.getElementById('typingIndicator')?.remove();
}

// ══════════════════════════════════════════════
async function handleCEPinMessage(text) {
  if (!window.GeoService) return null;
  const cep = GeoService.extractCEP(text);
  if (!cep) return null;

  const data = await GeoService.lookupCEP(cep);
  if (!data) return null;

  const parts = [
    data.logradouro ? `<strong>Logradouro:</strong> ${data.logradouro}` : null,
    data.bairro ? `<strong>Bairro:</strong> ${data.bairro}` : null,
    `<strong>Cidade:</strong> ${data.cidade}/${data.estado}`,
    `<strong>CEP:</strong> ${data.cep}`
  ].filter(Boolean);

  return `<div class="cep-card">
    <strong>📮 CEP Encontrado</strong><br>
    ${parts.join('<br>')}
    <br><br>
    <button class="msg-chip" onclick="openGeoModalWithCEP('${cep}')">&#128205; Ver CRAS/UBS nesta região</button>
  </div>`;
}

// ══════════════════════════════════════════════
async function processMessage(userText) {
  if (!userText.trim()) return;

  if (!currentConv) {
    currentConv = ConversationStore.create();
  }

  if (currentConv.messages.length === 0 || currentConv.title === 'Nova conversa') {
    currentConv.title = userText.slice(0, 45).trim() + (userText.length > 45 ? '…' : '');
  }

  renderMessage('user', escapeHTML(userText));
  conversationHistory.push({ role: 'user', text: userText });

  metrics.queries++;
  saveMetrics();

  showTypingIndicator();

  const cepPromise = handleCEPinMessage(userText);

  const lower = userText.toLowerCase();
  const isGreeting = ['oi','ola','olá','bom dia','boa tarde','boa noite','hello','salve','oi!','olá!'].some(g => lower.includes(g)) && userText.length < 30;

  if (isGreeting) {
    await delay(700);
    removeTypingIndicator();
    const gr = getGreetingResponse();
    renderMessage('ai', gr.text, gr.chips);
    conversationHistory.push({ role: 'model', text: gr.text });
    return;
  }

  if (AI.hasGeminiKey()) {
    try {
      const aiResponse = await AI.chat(userText, conversationHistory);
      if (aiResponse) {
        const cepExtra = await cepPromise;
        removeTypingIndicator();
        renderMessage('ai', aiResponse, ['INSS', 'Bolsa Família', 'Saúde', 'Trabalho'], [], cepExtra || '');
        conversationHistory.push({ role: 'model', text: aiResponse });
        return;
      }
    } catch (err) {
      console.warn('Gemini fell back to KB:', err.message);
    }
  }

  await delay(1100 + Math.random() * 700);
  removeTypingIndicator();

  const cepExtra = await cepPromise;
  const kbResult = detectIntent(userText);

  if (kbResult) {
    metrics.topics[kbResult.key] = (metrics.topics[kbResult.key] || 0) + 1;
    saveMetrics();
    renderMessage('ai', kbResult.text, kbResult.chips, kbResult.sources, cepExtra || '');
    conversationHistory.push({ role: 'model', text: kbResult.text });
  } else {
    const fb = getFallbackResponse();
    renderMessage('ai', fb.text, fb.chips, [], cepExtra || '');
    conversationHistory.push({ role: 'model', text: fb.text });
  }
}

// ══════════════════════════════════════════════
function renderConversationList() {
  const list = ConversationStore.getAll();
  convEmpty.style.display = list.length === 0 ? 'block' : 'none';

  Array.from(convList.querySelectorAll('.conv-item')).forEach(el => el.remove());

  list.forEach(conv => {
    const item = document.createElement('div');
    item.className = 'conv-item' + (currentConv && currentConv.id === conv.id ? ' active' : '');
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-id', conv.id);

    const age = formatRelativeTime(conv.updatedAt);
    const msgCount = conv.messages.length;

    item.innerHTML = `
      <span class="conv-item-icon">💬</span>
      <div class="conv-item-body">
        <div class="conv-item-title" title="${escapeHTML(conv.title)}">${escapeHTML(conv.title)}</div>
        <div class="conv-item-meta">${age} · ${msgCount} mensagem${msgCount !== 1 ? 's' : ''}</div>
      </div>
      <button class="conv-item-del" onclick="deleteConversation(event,'${conv.id}')" aria-label="Excluir conversa" title="Excluir">🗑️</button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.conv-item-del')) return;
      loadConversation(conv.id);
    });

    convList.insertBefore(item, convEmpty);
  });
}

function loadConversation(id) {
  const conv = ConversationStore.get(id);
  if (!conv) return;

  currentConv = conv;
  conversationHistory = [];

  Array.from(chatMessages.querySelectorAll('.message')).forEach(el => el.remove());
  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (docAnalyzer) docAnalyzer.style.display = 'none';

  conv.messages.forEach(msg => {
    const el = document.createElement('div');
    el.className = `message ${msg.role}`;
    const avatar = msg.role === 'ai' ? '📢' : '👤';
    const name = msg.role === 'ai' ? 'VozPública' : 'Você';
    el.innerHTML = `
      <div class="msg-avatar ${msg.role}" aria-hidden="true">${avatar}</div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-name">${name}</span>
          <span class="msg-time">${msg.time || ''}</span>
        </div>
        <div class="msg-content">${msg.html}</div>
      </div>`;
    chatMessages.appendChild(el);

    conversationHistory.push({ role: msg.role === 'ai' ? 'model' : 'user', text: msg.text || '' });
  });

  if (conv.messages.length > 0) {
    chatMessages.lastElementChild?.scrollIntoView({ block: 'end' });
  }

  renderConversationList();
  closeSidebar();
}

function deleteConversation(e, id) {
  e.stopPropagation();
  ConversationStore.remove(id);
  if (currentConv && currentConv.id === id) {
    startNewChat();
  }
  renderConversationList();
}

function startNewChat() {
  conversationHistory = [];
  currentConv = null;

  Array.from(chatMessages.querySelectorAll('.message')).forEach(el => el.remove());
  if (welcomeScreen) welcomeScreen.style.display = '';
  if (docAnalyzer) docAnalyzer.style.display = 'none';
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;

  renderConversationList();
}

// ══════════════════════════════════════════════
const geoModal = document.getElementById('geoModal');
const geoClose = document.getElementById('geoClose');
let _allFacilities = [];

function openGeoModal() {
  geoModal.style.display = 'flex';
  geoModal.setAttribute('aria-hidden', 'false');
  showGeoState('idle');
}

function openGeoModalWithCEP(cep) {
  openGeoModal();
  const input = document.getElementById('geoCepInput');
  if (input) input.value = cep;
  searchByCEP(cep);
}

function showGeoState(state) {
  ['idle','loading','error','results'].forEach(s => {
    const el = document.getElementById(`geoState${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (el) el.style.display = s === state ? (state === 'results' ? 'block' : 'flex') : 'none';
  });
}

async function searchByGeolocation() {
  if (!window.GeoService) {
    showGeoError('Módulo de geolocalização não carregado.');
    return;
  }
  showGeoState('loading');
  document.getElementById('geoLoadingText').textContent = 'Obtendo sua localização...';

  try {
    const loc = await GeoService.getUserLocation();
    document.getElementById('geoLoadingText').textContent = 'Buscando unidades próximas...';

    const [facilities, geo] = await Promise.all([
      GeoService.findNearbyFacilities(loc.lat, loc.lon),
      GeoService.reverseGeocode(loc.lat, loc.lon)
    ]);

    const locText = [geo.suburb, geo.city].filter(Boolean).join(', ') || 'sua localização';
    displayFacilities(facilities, locText);
  } catch (err) {
    showGeoError(err.message);
  }
}

// FIX: Removido header 'User-Agent' do fetch para o Nominatim.
// 'User-Agent' é um 'forbidden header name' na Fetch API do browser e causava falha
// silenciosa na geocodificação por CEP. Mantido apenas 'Accept-Language'.
async function searchByCEP(cepValue) {
  if (!window.GeoService) return;
  const cep = (cepValue || document.getElementById('geoCepInput').value).replace(/\D/g, '');
  if (cep.length !== 8) {
    showGeoError('CEP inválido. Digite 8 dígitos.');
    return;
  }

  showGeoState('loading');
  document.getElementById('geoLoadingText').textContent = 'Buscando pelo CEP...';

  try {
    const data = await GeoService.lookupCEP(cep);
    if (!data) { showGeoError('CEP não encontrado. Verifique e tente novamente.'); return; }

    document.getElementById('geoLoadingText').textContent = 'Buscando unidades próximas...';

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(data.logradouro + ', ' + data.cidade + ', ' + data.estado + ', Brasil')}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    );
    const geoData = await geoRes.json();
    if (!geoData.length) {
      showGeoError('Não foi possível localizar este CEP no mapa. Tente usar a localização automática.');
      return;
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    const facilities = await GeoService.findNearbyFacilities(lat, lon);
    const locText = [data.bairro, data.cidade].filter(Boolean).join(', ');
    displayFacilities(facilities, locText);
  } catch (err) {
    showGeoError('Erro ao buscar pelo CEP: ' + err.message);
  }
}

function showGeoError(msg) {
  document.getElementById('geoErrorMsg').textContent = msg;
  showGeoState('error');
}

function displayFacilities(facilities, locationLabel) {
  _allFacilities = facilities;
  document.getElementById('geoLocationText').textContent = locationLabel;
  renderFacilityList('all');
  showGeoState('results');
}

function renderFacilityList(filter) {
  const list = document.getElementById('facilityList');
  const items = filter === 'all'
    ? _allFacilities
    : _allFacilities.filter(f => f.type === filter || f.type.toLowerCase().includes(filter.toLowerCase()));

  if (items.length === 0) {
    list.innerHTML = `<div class="no-facilities">😔 Nenhuma unidade do tipo <strong>${filter}</strong> encontrada num raio de 6km.<br><br>Tente outro filtro ou ampliar a busca.</div>`;
    return;
  }

  list.innerHTML = items.map((f, i) => `
    <div class="facility-card" style="animation-delay:${i * 0.04}s" role="listitem">
      <div class="facility-icon-wrap" style="background:${f.color}18;border-color:${f.color}30">
        <span>${f.icon}</span>
      </div>
      <div class="facility-info">
        <span class="facility-type-badge" style="background:${f.color}">${f.type}</span>
        <div class="facility-name">${escapeHTML(f.name)}</div>
        ${f.address ? `<div class="facility-addr">📍 ${escapeHTML(f.address)}</div>` : ''}
        ${f.phone ? `<div class="facility-phone">📞 ${escapeHTML(f.phone)}</div>` : ''}
        <div class="facility-actions">
          <a href="${f.mapsLink}" target="_blank" rel="noopener" class="facility-link">🗺️ Como chegar</a>
          ${f.website ? `<a href="${f.website}" target="_blank" rel="noopener" class="facility-link">🌐 Site</a>` : ''}
        </div>
      </div>
      <div class="facility-distance">${f.distLabel}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
async function speakMessage(btn) {
  if (!btn) return;
  const msgContent = btn.closest('.msg-body')?.querySelector('.msg-content');
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

  const cleanup = () => {
    if (icon) icon.style.display = '';
    if (wave) wave.style.display = 'none';
  };
  document.addEventListener('tts-ended', cleanup, { once: true });
  await AI.speak(msgContent.textContent);
}

// ══════════════════════════════════════════════
function toggleDocAnalyzer() {
  const vis = docAnalyzer.style.display !== 'none';
  if (vis) {
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
  renderMessage('user', `📄 Analisando documento: ${escapeHTML(uploadedFile.name)}`);
  showTypingIndicator();

  const result = await DocAnalyzer.analyze(uploadedFile);
  removeTypingIndicator();

  if (result.success) {
    metrics.docs++;
    saveMetrics();
    renderMessage('ai', result.analysis, ['INSS', 'Documentos', 'Trabalho']);
  } else {
    renderMessage('ai', `⚠️ ${escapeHTML(result.error)}<br><br>
<strong>💡 Dicas:</strong><br>
<ul>
  <li>Tire uma foto mais clara e bem iluminada</li>
  <li>Certifique-se que todo o texto está legível</li>
  <li>Configure sua chave Gemini AI em ⚙️</li>
</ul>`);
  }

  uploadedFile = null;
  docPreview.style.display = 'none';
  dropZone.style.display = '';
}

// ══════════════════════════════════════════════
function startTopic(topicKey) {
  const topic = KB[topicKey];
  if (!topic) return;
  hideWelcome();

  metrics.topics[topicKey] = (metrics.topics[topicKey] || 0) + 1;
  saveMetrics();

  if (!currentConv) currentConv = ConversationStore.create();
  if (currentConv.title === 'Nova conversa') currentConv.title = topic.title;

  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    renderMessage('ai', topic.text, topic.chips, topic.sources);
    conversationHistory.push({ role: 'model', text: topic.text });
    closeSidebar();
  }, 550);
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
const TOPIC_LABELS = {
  inss: '🏛️ INSS',
  saude: '🏥 Saúde',
  bolsa: '💚 Bolsa Fam.',
  trabalho: '⚖️ Trabalho',
  educacao: '🎓 Educação',
  habitacao: '🏘️ Habitação',
  documentos: '📑 Docs',
  idoso: '👴 Idoso'
};

function saveMetrics() {
  localStorage.setItem('vp_metrics', JSON.stringify(metrics));
  updateDashboard();
}

function updateDashboard() {
  const q = document.getElementById('totalQueries');
  const t = document.getElementById('topicsExplored');
  const d = document.getElementById('docsAnalyzed');
  const chart = document.getElementById('dashTopicsChart');

  const topicCount = Object.keys(metrics.topics || {}).length;
  if (q) q.textContent = metrics.queries || 0;
  if (t) t.textContent = topicCount;
  if (d) d.textContent = metrics.docs || 0;

  if (!chart) return;

  const topTopics = Object.entries(metrics.topics || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  if (topTopics.length === 0) {
    chart.innerHTML = '<div class="dash-chart-label" style="text-align:center;padding:8px">Explore categorias para ver estatísticas</div>';
    return;
  }

  const maxVal = topTopics[0][1];
  const html = `
    <div class="dash-chart-label">Tópicos mais consultados</div>
    ${topTopics.map(([key, count]) => `
      <div class="dash-bar-row">
        <span class="dash-bar-label">${TOPIC_LABELS[key] || key}</span>
        <div class="dash-bar-track">
          <div class="dash-bar-fill" style="width:${Math.round((count / maxVal) * 100)}%"></div>
        </div>
        <span class="dash-bar-count">${count}</span>
      </div>
    `).join('')}
  `;
  chart.innerHTML = html;
}

// ══════════════════════════════════════════════
function applyFontSize() {
  document.documentElement.style.fontSize = currentFontSize + '%';
  if (fontSizeLabel) fontSizeLabel.textContent = currentFontSize + '%';
  localStorage.setItem('vp_fontSize', currentFontSize);
}

function applyContrast() {
  document.body.classList.toggle('high-contrast', isHighContrast);
  contrastToggle?.setAttribute('aria-checked', isHighContrast.toString());
  localStorage.setItem('vp_contrast', isHighContrast.toString());
}

function applyTheme() {
  document.body.classList.toggle('light-mode', isLightMode);
  const icon = themeToggleBtn?.querySelector('.theme-icon');
  if (icon) icon.textContent = isLightMode ? '☀️' : '🌙';
}

// ══════════════════════════════════════════════
function updateAPIStatus() {
  const gs = document.getElementById('geminiStatus');
  const es = document.getElementById('elevenLabsStatus');
  const bs = document.getElementById('backendStatus');
  const badge = document.getElementById('aiStatus');
  const st = AI.getStatus();

  if (gs) {
    if (st.serverGemini) {
      gs.textContent = '✅ Backend Python ativo — chave Gemini no servidor';
    } else if (st.localGemini) {
      gs.textContent = '✅ Chave local ativa — Gemini no navegador';
    } else {
      gs.textContent = '❌ Não configurado — usando base local';
    }
  }

  if (bs) {
    if (st.backendOnline) {
      bs.textContent = `✅ Backend online (${st.backendMode})`;
    } else {
      bs.textContent = '⚠️ Backend offline — usando modo navegador/base local';
    }
  }

  if (es) es.textContent = AI.hasElevenLabsKey() ? '✅ Conectado — Voz ElevenLabs ativa' : '❌ Não configurado — voz do navegador';
  if (aiStatusText) {
    if (st.serverGemini) aiStatusText.textContent = 'Backend IA';
    else if (st.localGemini) aiStatusText.textContent = 'Gemini AI';
    else aiStatusText.textContent = 'Base Local';
  }
  badge?.classList.toggle('ai-active', !!st.gemini);
}

// ══════════════════════════════════════════════
function setupVoiceInput() {
  const voiceBtn = document.getElementById('voiceMsgBtn');
  if (!voiceBtn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { voiceBtn.style.display = 'none'; return; }

  const recognition = new SR();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;
  let listening = false;

  voiceBtn.addEventListener('click', () => {
    if (listening) { recognition.stop(); return; }
    recognition.start();
    listening = true;
    voiceBtn.classList.add('voice-active');
    voiceBtn.textContent = '🔴';
  });

  recognition.onresult = e => {
    const t = e.results[0][0].transcript;
    messageInput.value = t;
    sendBtn.disabled = false;
    processMessage(t);
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
function openSidebar() {
  sidebar?.classList.add('open');
  sidebarOverlay?.classList.add('visible');
  sidebarOverlay?.setAttribute('aria-hidden', 'false');
}
function closeSidebar() {
  sidebar?.classList.remove('open');
  sidebarOverlay?.classList.remove('visible');
  sidebarOverlay?.setAttribute('aria-hidden', 'true');
}

// ══════════════════════════════════════════════
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setLanguage(mode) { /* placeholder */ }

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'agora mesmo';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d atrás`;
  return new Date(ts).toLocaleDateString('pt-BR');
}

function migrateMetrics() {
  if (Array.isArray(metrics.topics)) {
    const obj = {};
    metrics.topics.forEach(t => { obj[t] = (obj[t] || 0) + 1; });
    metrics.topics = obj;
    localStorage.setItem('vp_metrics', JSON.stringify(metrics));
  }
}

// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  migrateMetrics();

  messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim();
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  });

  messageInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = messageInput.value.trim();
      if (text) {
        processMessage(text);
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;
      }
    }
  });

  sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
      processMessage(text);
      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendBtn.disabled = true;
    }
  });

  newChatBtn.addEventListener('click', e => { e.preventDefault(); startNewChat(); });

  clearHistoryBtn?.addEventListener('click', () => {
    if (confirm('Apagar todo o histórico de conversas?')) {
      ConversationStore.clear();
      startNewChat();
    }
  });

  sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay?.addEventListener('click', closeSidebar);

  accessibilityToggle?.addEventListener('click', () => {
    const isOpen = a11yPanel.getAttribute('aria-hidden') === 'false';
    a11yPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    accessibilityToggle.setAttribute('aria-expanded', (!isOpen).toString());
  });
  document.getElementById('fontIncrease')?.addEventListener('click', () => {
    if (currentFontSize < 150) { currentFontSize += 10; applyFontSize(); }
  });
  document.getElementById('fontDecrease')?.addEventListener('click', () => {
    if (currentFontSize > 70) { currentFontSize -= 10; applyFontSize(); }
  });
  contrastToggle?.addEventListener('click', () => { isHighContrast = !isHighContrast; applyContrast(); });
  ttsToggle?.addEventListener('click', () => {
    autoTTS = !autoTTS;
    ttsToggle.setAttribute('aria-checked', autoTTS.toString());
    localStorage.setItem('vp_autoTTS', autoTTS.toString());
  });
  themeToggleBtn?.addEventListener('click', () => {
    isLightMode = !isLightMode;
    localStorage.setItem('vp_theme', isLightMode ? 'light' : 'dark');
    applyTheme();
  });

  settingsBtn?.addEventListener('click', () => {
    settingsModal.setAttribute('aria-hidden', 'false');
    settingsModal.style.display = 'flex';
    const gInput = document.getElementById('geminiKeyInput');
    const eInput = document.getElementById('elevenLabsKeyInput');
    const bInput = document.getElementById('backendUrlInput');
    if (AI.hasLocalGeminiKey()) gInput.value = '••••••••••••';
    if (AI.hasElevenLabsKey()) eInput.value = '••••••••••••';
    if (bInput) bInput.value = AI.getBackendURL();
    updateAPIStatus();
  });
  settingsClose?.addEventListener('click', () => { settingsModal.setAttribute('aria-hidden','true'); settingsModal.style.display='none'; });
  settingsModal?.addEventListener('click', e => { if (e.target === settingsModal) { settingsModal.setAttribute('aria-hidden','true'); settingsModal.style.display='none'; } });
  document.getElementById('saveGeminiKey')?.addEventListener('click', () => {
    const val = document.getElementById('geminiKeyInput').value.trim();
    if (val && !val.startsWith('••')) { AI.setGeminiKey(val); }
    updateAPIStatus();
  });
  document.getElementById('saveBackendUrl')?.addEventListener('click', async () => {
    const val = document.getElementById('backendUrlInput').value.trim();
    AI.setBackendURL(val);
    await AI.probeBackend(true);
    updateAPIStatus();
  });
  document.getElementById('saveElevenLabsKey')?.addEventListener('click', () => {
    const val = document.getElementById('elevenLabsKeyInput').value.trim();
    if (val && !val.startsWith('••')) { AI.setElevenLabsKey(val); }
    updateAPIStatus();
  });

  guideBtn?.addEventListener('click', () => { guideModal.setAttribute('aria-hidden','false'); guideModal.style.display='flex'; });
  guideClose?.addEventListener('click', () => { guideModal.setAttribute('aria-hidden','true'); guideModal.style.display='none'; });
  guideModal?.addEventListener('click', e => { if(e.target===guideModal){guideModal.setAttribute('aria-hidden','true');guideModal.style.display='none';} });

  aboutBtn?.addEventListener('click', () => { aboutModal.setAttribute('aria-hidden','false'); aboutModal.style.display='flex'; });
  aboutClose?.addEventListener('click', () => { aboutModal.setAttribute('aria-hidden','true'); aboutModal.style.display='none'; });
  aboutModal?.addEventListener('click', e => { if(e.target===aboutModal){aboutModal.setAttribute('aria-hidden','true');aboutModal.style.display='none';} });

  geoClose?.addEventListener('click', () => { geoModal.setAttribute('aria-hidden','true'); geoModal.style.display='none'; });
  geoModal?.addEventListener('click', e => { if(e.target===geoModal){geoModal.setAttribute('aria-hidden','true');geoModal.style.display='none';} });
  document.getElementById('geoSearchBtn')?.addEventListener('click', searchByGeolocation);
  document.getElementById('geoRetryBtn')?.addEventListener('click', () => showGeoState('idle'));
  document.getElementById('geoCepBtn')?.addEventListener('click', () => searchByCEP());
  document.getElementById('geoCepInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchByCEP();
  });

  document.getElementById('geoFilterRow')?.addEventListener('click', e => {
    const btn = e.target.closest('.geo-filter-btn');
    if (!btn) return;
    document.querySelectorAll('.geo-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFacilityList(btn.dataset.filter);
  });

  topicSearchInput?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    topicBtns.forEach(btn => {
      const text = btn.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      btn.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      topicSearchInput?.focus();
    }
    if (e.key === 'Escape') {
      [settingsModal, guideModal, aboutModal, geoModal].forEach(m => {
        if (m && m.style.display === 'flex') {
          m.setAttribute('aria-hidden','true');
          m.style.display = 'none';
        }
      });
      if (a11yPanel.getAttribute('aria-hidden') === 'false') {
        a11yPanel.setAttribute('aria-hidden','true');
      }
    }
  });

  dropZone?.addEventListener('click', () => docFileInput.click());
  dropZone?.addEventListener('keydown', e => { if (e.key === 'Enter') docFileInput.click(); });
  dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-active'); });
  dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));
  dropZone?.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('drag-active');
    if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files[0]);
  });
  docFileInput?.addEventListener('change', e => { if (e.target.files.length) handleFileUpload(e.target.files[0]); });

  applyFontSize();
  applyContrast();
  applyTheme();
  if (autoTTS) ttsToggle?.setAttribute('aria-checked', 'true');
  updateDashboard();
  AI.init().finally(updateAPIStatus);
  setupVoiceInput();
  renderConversationList();
});

// ══════════════════════════════════════════════
async function handleFileUpload(file) {
  const validation = DocAnalyzer.validateFile(file);
  if (!validation.valid) { alert(validation.error); return; }
  uploadedFile = file;
  const preview = await DocAnalyzer.createPreview(file);
  if (preview) {
    docPreviewImg.src = preview;
    docPreview.style.display = 'block';
    dropZone.style.display = 'none';
  } else {
    docPreviewImg.src = '';
    docPreview.style.display = 'block';
    dropZone.style.display = 'none';
    docPreviewImg.alt = `Arquivo: ${file.name}`;
  }
}

// ══════════════════════════════════════════════
window.startTopic = startTopic;
window.handleChipClick = handleChipClick;
window.toggleDocAnalyzer = toggleDocAnalyzer;
window.analyzeUploadedDoc = analyzeUploadedDoc;
window.speakMessage = speakMessage;
window.setLanguage = setLanguage;
window.openGeoModal = openGeoModal;
window.openGeoModalWithCEP = openGeoModalWithCEP;
window.deleteConversation = deleteConversation;
