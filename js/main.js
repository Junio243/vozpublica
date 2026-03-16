/* ==========================================
   VozPública — Landing Page JavaScript
   ========================================== */

'use strict';

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Scroll reveal animation ──
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// ── Animated stat counters ──
const statElements = document.querySelectorAll('.stat-number[id]');
statElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.transition = 'all 0.5s ease';
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statElements.forEach(el => counterObserver.observe(el));

// ── Demo Chat Simulation ──
const chatResponses = {
  INSS: {
    user: 'Quero saber sobre aposentadoria pelo INSS',
    ai: `<strong>Claro! 😊</strong> Vou te explicar sobre aposentadoria pelo INSS de forma simples.<br><br>
    Existem <strong>3 principais tipos de aposentadoria</strong>:<br>
    <ul>
      <li>🕐 <strong>Por tempo de contribuição</strong>: 35 anos (homem) ou 30 anos (mulher)</li>
      <li>🎂 <strong>Por idade</strong>: 65 anos (homem) ou 62 anos (mulher) + mínimo de contribuições</li>
      <li>♿ <strong>Por incapacidade</strong>: quando há limitação médica comprovada</li>
    </ul>
    <br>💡 <span class="highlight-box">Dica importante</span>: Você pode simular sua aposentadoria gratuitamente no portal <strong>Meu INSS</strong> (meu.inss.gov.br)`,
    chips: ['Quanto vou receber?', 'Como dar entrada?', 'Carência mínima']
  },
  saude: {
    user: 'Como faço pra marcar consulta pelo SUS?',
    ai: `<strong>Ótima pergunta! 🏥</strong> O SUS oferece atendimento gratuito para todos os brasileiros.<br><br>
    Para marcar uma consulta, siga esses passos:<br>
    <ul>
      <li>1️⃣ Vá até a <strong>UBS (Unidade Básica de Saúde)</strong> mais próxima de sua casa</li>
      <li>2️⃣ Leve <strong>RG, CPF e Cartão SUS</strong> (se não tiver cartão SUS, eles emitem na hora)</li>
      <li>3️⃣ Informe sua queixa ao atendente</li>
      <li>4️⃣ Você pode também usar o app <strong>Meu SUS Digital</strong> para agendar online</li>
    </ul>
    <br>💡 <span class="highlight-box">Direito importante</span>: O atendimento emergencial no SUS <strong>não pode ser negado</strong>, mesmo sem documentos.`,
    chips: ['Onde fica a UBS mais próxima?', 'E se for emergência?', 'Especialistas pelo SUS']
  },
  bolsa: {
    user: 'Tenho direito ao Bolsa Família?',
    ai: `<strong>Vamos verificar juntos! 💚</strong> O Bolsa Família tem alguns requisitos principais:<br><br>
    <strong>Quem pode se inscrever:</strong><br>
    <ul>
      <li>✅ Famílias em <strong>situação de pobreza</strong> (renda até R$ 218 por pessoa/mês)</li>
      <li>✅ Estar inscrito no <strong>Cadastro Único (CadÚnico)</strong></li>
      <li>✅ Crianças até 7 anos precisam estar <strong>vacinadas</strong></li>
      <li>✅ Crianças de 6 a 17 anos precisam estar <strong>na escola</strong></li>
    </ul>
    <br>💡 <span class="highlight-box">Próximo passo</span>: Procure o <strong>CRAS mais próximo</strong> da sua casa para se inscrever no CadÚnico gratuitamente.`,
    chips: ['Qual valor recebo?', 'Como se inscrever?', 'O que é CadÚnico?']
  },
  trabalho: {
    user: 'Me demitiram sem justa causa, o que tenho direito?',
    ai: `<strong>Entendo sua situação. 💼</strong> Se você foi demitido sem justa causa, você tem vários direitos garantidos pela CLT:<br><br>
    <ul>
      <li>💰 <strong>Saldo de salário</strong>: os dias trabalhados no mês</li>
      <li>🏖️ <strong>Férias proporcionais</strong> + 1/3 constitucional</li>
      <li>📅 <strong>13º proporcional</strong> ao meses trabalhados</li>
      <li>📋 <strong>Aviso prévio</strong> (trabalhado ou indenizado)</li>
      <li>🏦 <strong>FGTS</strong>: saque do saldo + multa de 40%</li>
      <li>🛡️ <strong>Seguro-desemprego</strong> (se cumprir os requisitos)</li>
    </ul>
    <br>💡 <span class="highlight-box">Prazo importante</span>: Você tem <strong>2 anos</strong> para reclamar seus direitos trabalhistas na Justiça.`,
    chips: ['Como pedir seguro-desemprego?', 'E o prazo do aviso prévio?', 'Sindicato pode ajudar?']
  }
};

function simulateChat(topic) {
  const demoChat = document.getElementById('demo-chat');
  if (!demoChat) return;

  const data = chatResponses[topic];
  if (!data) return;

  // Clear chips from first message
  const chips = demoChat.querySelector('.chat-chips');
  if (chips) chips.style.display = 'none';

  // Add user message
  const userMsg = createDemoMessage('user', data.user);
  demoChat.appendChild(userMsg);

  // Add typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg ai';
  typing.id = 'demo-typing';
  typing.innerHTML = `<div class="chat-avatar ai" aria-hidden="true">🌎</div><div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  demoChat.appendChild(typing);
  demoChat.scrollTop = demoChat.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById('demo-typing');
    if (typingEl) typingEl.remove();

    const aiMsg = createDemoMessage('ai', data.ai, data.chips);
    demoChat.appendChild(aiMsg);
    demoChat.scrollTop = demoChat.scrollHeight;
  }, 1600);
}

function createDemoMessage(type, content, chips = []) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  const avatar = type === 'ai' ? '📢' : '👤';
  let chipsHTML = '';
  if (chips.length) {
    chipsHTML = `<div class="chat-chips">${chips.map(c => `<button class="chip" tabindex="0">${c}</button>`).join('')}</div>`;
  }
  msg.innerHTML = `
    <div class="chat-avatar ${type}" aria-label="${type === 'ai' ? 'CidadãoAI' : 'Você'}" aria-hidden="true">${avatar}</div>
    <div class="chat-bubble">${content}${chipsHTML}</div>
  `;
  return msg;
}

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Theme Toggle ──
const themeToggleBtn = document.getElementById('themeToggleBtn');
const currentTheme = localStorage.getItem('vp_theme');
if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  if (themeToggleBtn) themeToggleBtn.querySelector('.theme-icon').textContent = '☀️';
}
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('vp_theme', isLight ? 'light' : 'dark');
    themeToggleBtn.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
  });
}

// ── Expose to global scope for inline onclick ──
window.simulateChat = simulateChat;
