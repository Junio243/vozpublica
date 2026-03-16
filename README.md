# 📢 VozPública

> **IA que dá voz aos seus direitos** — Assistente digital para cidadãos brasileiros acessarem serviços públicos e entenderem seus direitos.

<div align="center">

![VozPública Demo](https://raw.githubusercontent.com/Junio243/vozpublica/main/vozpublica_final_demo_1773620739744.webp)

*Demonstração completa: Landing page → Chatbot → Configurações de IA → Acessibilidade*

</div>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-000000?style=for-the-badge&logo=elevenlabs&logoColor=white)](https://elevenlabs.io/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 🌍 The Problem

In Brazil, **70+ million citizens** struggle to access basic public services and understand their rights due to:

- 📉 **Digital exclusion** — 67% of elderly people can't navigate digital government platforms
- 📄 **Bureaucratic language** — Legal documents use complex "juridiquês" that most people can't understand
- 💰 **R$42 billion/year** in unclaimed benefits because people don't know what they're entitled to
- 🏚️ **Geographic barriers** — Remote communities lack access to government offices

## 💡 Our Solution

**VozPública** is an AI-powered civic assistant that breaks down barriers between citizens and their rights:

- 🤖 **Gemini AI** for intelligent, contextual conversations in simple Portuguese
- 🔊 **ElevenLabs TTS** for natural voice responses (crucial for low-literacy users)
- 📄 **Document Analyzer** — upload a government document photo and get a plain-language explanation
- 📱 **PWA** — installable, works offline, zero setup required
- ♿ **WCAG 2.1 AA** — adjustable fonts, high contrast, voice input, screen reader support

## 🎯 Impact

| Metric | Value |
|---|---|
| 🎯 Target users | 70M+ Brazilians with low digital literacy |
| 📚 Knowledge areas | 8 categories (INSS, healthcare, education, housing, etc.) |
| 📞 Direct links | Government portals + emergency phone numbers |
| 🌐 Access | 100% free, no registration, works offline |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript ES6+ |
| **AI Engine** | Google Gemini 2.0 Flash API |
| **Text-to-Speech** | ElevenLabs Multilingual v2 |
| **Document Analysis** | Gemini Vision API |
| **Architecture** | PWA + Service Worker (offline-first) |
| **Accessibility** | WCAG 2.1 AA compliance |

## 📂 Project Structure

```
Projeto/
├── index.html          ← Modern landing page
├── app.html            ← AI chatbot application
├── manifest.json       ← PWA manifest
├── sw.js               ← Service worker (offline support)
├── css/
│   ├── style.css       ← Landing page design system
│   └── app.css         ← Chat application styles
├── js/
│   ├── main.js         ← Landing page interactions
│   ├── app.js          ← Chatbot engine + knowledge base
│   ├── ai.js           ← Gemini AI + ElevenLabs integration
│   └── analyzer.js     ← Document analysis module
├── assets/
│   ├── hero.png        ← AI-generated hero illustration
│   └── logo.png        ← VozPública logo
├── README.md
└── LICENSE             ← MIT License
```

## 🚀 Getting Started

### Quick Start (No API keys needed)
1. Open `index.html` in any modern browser
2. Click **"Testar Gratuitamente"** to access the chatbot
3. Start asking about your rights! 🎉

### With AI Features
1. Get a **Gemini API key** (free) at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Get an **ElevenLabs API key** (free tier) at [elevenlabs.io](https://elevenlabs.io)
3. Open the app and click **⚙️ Config** to enter your keys
4. Keys are stored **only in your browser** (localStorage) — never sent to external servers

## 🏗️ Features

### 🤖 AI Chat (Gemini + Local Fallback)
- Intelligent conversations about Brazilian civic rights
- Falls back to comprehensive local knowledge base when offline
- 8 topic categories with detailed, actionable information

### 🔊 Voice (ElevenLabs + Browser TTS)
- Natural Portuguese speech synthesis via ElevenLabs
- 🔊 button on every AI response to hear it read aloud
- Automatic reading mode for elderly users
- Fallback to browser's built-in TTS

### 📄 Document Analyzer
- Upload a photo of any government document
- AI analyzes and explains it in plain language
- Identifies key information, deadlines, and required actions

### 📱 PWA (Progressive Web App)
- Installable on any device
- Service Worker caches all assets for offline access
- Cache-first for assets, network-first for API calls

### ♿ Accessibility
- Adjustable font sizes (70%-150%)
- High contrast mode
- Voice input via Web Speech API
- Full keyboard navigation
- ARIA labels on all interactive elements

## 📊 Scalability Roadmap

1. **Phase 1 (Current)** — Web prototype with local + AI responses
2. **Phase 2** — Integration with Gov.br APIs for real-time data
3. **Phase 3** — Municipal partnerships (CRAS, health centers)
4. **Phase 4** — WhatsApp/Telegram bot for even broader reach
5. **Phase 5** — LIBRAS sign language support via avatar

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with 💚 for Brazil</p>
