/* ==========================================
   VozPública — AI Engine (ai.js)
   Gemini AI + ElevenLabs TTS Integration
   ========================================== */

'use strict';

const AI = (() => {
  // ── Configuration ──
  const CONFIG = {
    gemini: {
      model: 'gemini-2.0-flash',
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      systemPrompt: `Você é o VozPública, um assistente virtual brasileiro especializado em direitos dos cidadãos e serviços públicos.

REGRAS IMPORTANTES:
1. Responda SEMPRE em português brasileiro simples, acessível para pessoas com baixa escolaridade
2. NUNCA use juridiquês ou termos técnicos sem explicar em linguagem do dia a dia
3. Seja acolhedor, empático e paciente como se estivesse ajudando um avô/avó querido(a)
4. Sempre inclua PRÓXIMOS PASSOS concretos (onde ir, que documentos levar, que site acessar)
5. Quando relevante, mencione o número do telefone público (ex: 135 para INSS, 156 prefeitura)
6. Formate suas respostas com HTML: use <strong>, <ul>, <li>, <br> para ficarem legíveis
7. Use emojis relevantes para tornar a leitura mais amigável para pessoas com dificuldade de leitura
8. Se não souber a resposta com certeza, diga que o cidadão deve procurar o órgão competente

ÁREAS DE ESPECIALIDADE:
- INSS e aposentadoria (tipos, regras pós-reforma 2019, cálculo, como solicitar)
- Bolsa Família / CadÚnico / CRAS
- SUS (direitos, UBS, UPA, medicamentos gratuitos, Farmácia Popular)
- Direitos trabalhistas (CLT, FGTS, férias, 13º, rescisão, seguro-desemprego)
- Educação (PROUNI, FIES, SISU, EJA, ENCCEJA, cursos gratuitos)
- Habitação (Minha Casa Minha Vida, direitos do inquilino, despejo)
- Documentos (CPF, RG, certidões, Título de Eleitor, Gov.br)
- Direitos do idoso (Estatuto do Idoso, BPC/LOAS, gratuidades)
- Direitos da pessoa com deficiência
- Direitos do consumidor (Procon)

Responda a mensagem do cidadão abaixo:`
    },
    elevenlabs: {
      apiUrl: 'https://api.elevenlabs.io/v1/text-to-speech',
      voiceId: 'pFZP5JQG7iQjIQuC4Bku', // Lily - clear female voice
      modelId: 'eleven_multilingual_v2',
      settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true
      }
    }
  };

  // ── State ──
  let geminiKey = localStorage.getItem('vp_gemini_key') || '';
  let elevenLabsKey = localStorage.getItem('vp_elevenlabs_key') || '';
  let currentAudio = null;

  // ── Gemini API ──
  async function chatWithGemini(message, history = []) {
    if (!geminiKey) return null;

    const contents = [];

    // Add conversation history
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text.replace(/<[^>]*>/g, '') }]
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    try {
      const response = await fetch(
        `${CONFIG.gemini.apiUrl}/${CONFIG.gemini.model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: CONFIG.gemini.systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
              topP: 0.9
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
          })
        }
      );

      if (!response.ok) {
        console.warn('Gemini API error:', response.status);
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err) {
      console.warn('Gemini API error:', err);
      return null;
    }
  }

  // ── Gemini Vision API (Document Analyzer) ──
  async function analyzeDocument(base64Image, mimeType = 'image/jpeg') {
    if (!geminiKey) return null;

    try {
      const response = await fetch(
        `${CONFIG.gemini.apiUrl}/${CONFIG.gemini.model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                  }
                },
                {
                  text: `Você é o VozPública. Analise este documento governamental brasileiro e explique seu conteúdo em linguagem MUITO simples, como se estivesse explicando para um idoso que não entende burocracia.

Inclua:
1. 📋 O que é este documento (tipo e finalidade)
2. 📝 Resumo do conteúdo principal em bullets simples
3. ⚠️ Pontos importantes que a pessoa precisa prestar atenção (prazos, valores, obrigações)
4. ✅ Próximos passos: o que a pessoa precisa fazer com este documento

Use HTML para formatar (<strong>, <ul>, <li>, <br>). Use emojis para facilitar a leitura.`
                }
              ]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2000
            }
          })
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.warn('Vision API error:', err);
      return null;
    }
  }

  // ── ElevenLabs TTS ──
  async function speak(text) {
    // Stop any current playback
    stopSpeaking();

    const plainText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[•·]/g, ',')
      .trim()
      .slice(0, 2500); // Limit for API

    // Try ElevenLabs first
    if (elevenLabsKey) {
      try {
        const response = await fetch(
          `${CONFIG.elevenlabs.apiUrl}/${CONFIG.elevenlabs.voiceId}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': elevenLabsKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: plainText,
              model_id: CONFIG.elevenlabs.modelId,
              voice_settings: CONFIG.elevenlabs.settings
            })
          }
        );

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          currentAudio = new Audio(audioUrl);
          currentAudio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            document.dispatchEvent(new CustomEvent('tts-ended'));
          });
          document.dispatchEvent(new CustomEvent('tts-started'));
          await currentAudio.play();
          return true;
        }
      } catch (err) {
        console.warn('ElevenLabs TTS error:', err);
      }
    }

    // Fallback to browser TTS
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.onstart = () => document.dispatchEvent(new CustomEvent('tts-started'));
      utterance.onend = () => document.dispatchEvent(new CustomEvent('tts-ended'));
      window.speechSynthesis.speak(utterance);
      return true;
    }

    return false;
  }

  function stopSpeaking() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    document.dispatchEvent(new CustomEvent('tts-ended'));
  }

  function isSpeaking() {
    return (currentAudio && !currentAudio.paused) ||
           (window.speechSynthesis && window.speechSynthesis.speaking);
  }

  // ── API Key Management ──
  function setGeminiKey(key) {
    geminiKey = key;
    localStorage.setItem('vp_gemini_key', key);
  }

  function setElevenLabsKey(key) {
    elevenLabsKey = key;
    localStorage.setItem('vp_elevenlabs_key', key);
  }

  function hasGeminiKey() { return !!geminiKey; }
  function hasElevenLabsKey() { return !!elevenLabsKey; }

  function getStatus() {
    return {
      gemini: !!geminiKey,
      elevenlabs: !!elevenLabsKey,
      browserTTS: 'speechSynthesis' in window
    };
  }

  // ── Public API ──
  return {
    chat: chatWithGemini,
    analyzeDocument,
    speak,
    stopSpeaking,
    isSpeaking,
    setGeminiKey,
    setElevenLabsKey,
    hasGeminiKey,
    hasElevenLabsKey,
    getStatus
  };
})();
