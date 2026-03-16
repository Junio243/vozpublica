/* ==========================================
   VozPública — Document Analyzer (analyzer.js)
   Upload and analyze government documents
   ========================================== */

'use strict';

const DocAnalyzer = (() => {
  let isAnalyzing = false;

  // ── File to Base64 ──
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ── Get MIME type ──
  function getMimeType(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const mimes = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
      'png': 'image/png', 'gif': 'image/gif',
      'webp': 'image/webp', 'pdf': 'application/pdf'
    };
    return mimes[ext] || file.type || 'image/jpeg';
  }

  // ── Validate file ──
  function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo: 10MB' };
    }

    const mime = getMimeType(file);
    if (!allowedTypes.includes(mime)) {
      return { valid: false, error: 'Tipo inválido. Aceito: JPG, PNG, GIF, WebP, PDF' };
    }

    return { valid: true, mime };
  }

  // ── Analyze document ──
  async function analyze(file) {
    if (isAnalyzing) return { error: 'Já estou analisando um documento' };
    if (!AI.hasGeminiKey()) return { error: 'Configure sua chave do Gemini AI para usar o analisador' };

    const validation = validateFile(file);
    if (!validation.valid) return { error: validation.error };

    isAnalyzing = true;
    try {
      const base64 = await fileToBase64(file);
      const result = await AI.analyzeDocument(base64, validation.mime);

      if (!result) {
        return { error: 'Não consegui analisar este documento. Tente com uma imagem mais clara.' };
      }

      return { success: true, analysis: result };
    } catch (err) {
      console.error('Document analysis error:', err);
      return { error: 'Erro ao analisar o documento. Tente novamente.' };
    } finally {
      isAnalyzing = false;
    }
  }

  // ── Create preview ──
  function createPreview(file) {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve(null); // PDF won't have image preview
      }
    });
  }

  return {
    analyze,
    createPreview,
    validateFile,
    get isAnalyzing() { return isAnalyzing; }
  };
})();
