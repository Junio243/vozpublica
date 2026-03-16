/* ==========================================
   VozPública — GeoService (geo.js)
   Geolocalização de CRAS/UBS + ViaCEP
   ========================================== */

'use strict';

const GeoService = (() => {
  const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
  const VIACEP_URL = 'https://viacep.com.br/ws';

  let _userLocation = null;

  // ── Obter localização do usuário ──
  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada neste navegador.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          _userLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          resolve(_userLocation);
        },
        err => {
          const msgs = {
            1: 'Permissão de localização negada. Ative nas configurações do navegador.',
            2: 'Localização indisponível no momento.',
            3: 'Tempo esgotado ao obter localização.'
          };
          reject(new Error(msgs[err.code] || 'Erro ao obter localização.'));
        },
        { timeout: 12000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    });
  }

  // ── Geocodificação reversa (cidade/bairro) ──
  // FIX: Removido header 'User-Agent' que é proibido em requisições fetch do browser (CORS)
  async function reverseGeocode(lat, lon) {
    try {
      const url = `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=pt-BR`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
      const data = await res.json();
      const addr = data.address || {};
      return {
        city: addr.city || addr.town || addr.municipality || addr.county || '',
        suburb: addr.suburb || addr.neighbourhood || addr.quarter || '',
        state: addr.state || '',
        display: data.display_name || ''
      };
    } catch {
      return { city: '', suburb: '', state: '', display: '' };
    }
  }

  // ── Buscar unidades próximas via Overpass API ──
  // FIX: Query ampliada para incluir nós sem filtro de nome, cobrindo a maioria dos
  //      CRAS/UBS brasileiros que não têm tags padronizadas no OpenStreetMap.
  //      Também adicionado tratamento explícito de rate limit (429/504).
  async function findNearbyFacilities(lat, lon, radiusMeters = 6000) {
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="social_facility"](around:${radiusMeters},${lat},${lon});
        node["amenity"="social_facility"]["social_facility"="outreach"](around:${radiusMeters},${lat},${lon});
        node["office"="government"]["name"~"CRAS|CREAS|Centro de Referência|Assistência Social",i](around:${radiusMeters},${lat},${lon});
        node["office"="government"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"]["name"~"UBS|Unidade Básica|Posto de Saúde|Centro de Saúde",i](around:${radiusMeters},${lat},${lon});
        node["healthcare"="centre"](around:${radiusMeters},${lat},${lon});
        node["amenity"="doctors"]["name"~"UBS|Unidade Básica",i](around:${radiusMeters},${lat},${lon});
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        node["amenity"="pharmacy"]["dispensing"="yes"](around:2000,${lat},${lon});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        way["amenity"="social_facility"](around:${radiusMeters},${lat},${lon});
        way["healthcare"="centre"](around:${radiusMeters},${lat},${lon});
      );
      out center body;
    `;

    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query)
      });

      if (res.status === 429 || res.status === 504) {
        throw new Error('rate_limit');
      }
      if (!res.ok) throw new Error(`Overpass API indisponível: Status ${res.status}`);
      const data = await res.json();

      const seen = new Set();
      const facilities = (data.elements || []).map(el => {
        const tags = el.tags || {};
        const name = tags.name || tags['name:pt'] || '';
        if (!name) return null;

        // Elimina duplicatas pelo nome + coordenada aproximada
        const key = name.toLowerCase().slice(0, 20);
        if (seen.has(key)) return null;
        seen.add(key);

        // way elements têm center em vez de lat/lon direto
        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;
        if (!elLat || !elLon) return null;

        const distance = calcDistance(lat, lon, elLat, elLon);
        const type = detectType(name, tags.amenity, tags.office, tags['social_facility'], tags['healthcare']);

        return {
          id: el.id,
          name,
          type,
          icon: getTypeIcon(type),
          color: getTypeColor(type),
          address: buildAddress(tags),
          phone: tags.phone || tags['contact:phone'] || tags['phone:br'] || null,
          website: tags.website || tags['contact:website'] || null,
          lat: elLat,
          lon: elLon,
          distance,
          distLabel: formatDistance(distance),
          mapsLink: `https://www.google.com/maps/search/?api=1&query=${elLat},${elLon}`
        };
      })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 15);

      return facilities;
    } catch (err) {
      console.error('GeoService [findNearbyFacilities] Error:', err);
      if (err.message === 'rate_limit') {
        throw new Error('Serviço temporariamente sobrecarregado. Aguarde 30 segundos e tente novamente.');
      }
      throw new Error('Não foi possível buscar unidades próximas. Verifique sua conexão.');
    }
  }

  // ── Detectar tipo da unidade ──
  function detectType(name, amenity, office, socialFacility, healthcare) {
    const n = name.toLowerCase();
    if (n.includes('creas')) return 'CREAS';
    if (n.includes('cras')) return 'CRAS';
    if (n.includes('hospital')) return 'Hospital';
    if (n.includes('upa')) return 'UPA 24h';
    if (n.includes('ubs') || n.includes('unidade básica') || n.includes('posto de saúde') || n.includes('centro de saúde')) return 'UBS';
    if (amenity === 'hospital') return 'Hospital';
    if (amenity === 'pharmacy') return 'Farmácia Popular';
    if (amenity === 'clinic' || healthcare === 'centre') return 'Clínica';
    if (n.includes('assist') || n.includes('social') || socialFacility) return 'Serviço Social';
    if (office === 'government') return 'Serviço Público';
    return 'Serviço Público';
  }

  function getTypeIcon(type) {
    const icons = {
      'CRAS': '🏛️', 'CREAS': '🏛️', 'UBS': '🏥', 'UPA 24h': '🚑',
      'Hospital': '🏨', 'Farmácia Popular': '💊', 'Clínica': '🩺',
      'Serviço Social': '🤝', 'Serviço Público': '🏢'
    };
    return icons[type] || '🏢';
  }

  function getTypeColor(type) {
    const colors = {
      'CRAS': '#3ecfb2', 'CREAS': '#50e8c9', 'UBS': '#22c55e',
      'UPA 24h': '#f59e0b', 'Hospital': '#ef4444', 'Farmácia Popular': '#7c3aed',
      'Clínica': '#06b6d4', 'Serviço Social': '#8b5cf6', 'Serviço Público': '#64748b'
    };
    return colors[type] || '#64748b';
  }

  // ── Montar endereço a partir das tags ──
  function buildAddress(tags) {
    const parts = [];
    if (tags['addr:street']) {
      let street = tags['addr:street'];
      if (tags['addr:housenumber']) street += ', ' + tags['addr:housenumber'];
      parts.push(street);
    }
    if (tags['addr:neighbourhood'] || tags['addr:suburb']) {
      parts.push(tags['addr:neighbourhood'] || tags['addr:suburb']);
    }
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push('CEP ' + tags['addr:postcode']);
    return parts.length > 0 ? parts.join(' — ') : null;
  }

  // ── Cálculo de distância (Haversine) ──
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function formatDistance(meters) {
    if (meters < 100) return 'Menos de 100m';
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }

  // ── Consulta de CEP via ViaCEP ──
  async function lookupCEP(cep) {
    const cleaned = String(cep).replace(/\D/g, '');
    if (cleaned.length !== 8) return null;
    try {
      const res = await fetch(`${VIACEP_URL}/${cleaned}/json/`);
      const data = await res.json();
      if (data.erro) return null;
      return {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        ibge: data.ibge,
        formatted: [data.logradouro, data.bairro, data.localidade + '/' + data.uf, 'CEP: ' + data.cep]
          .filter(Boolean).join(', ')
      };
    } catch {
      return null;
    }
  }

  // ── Detectar CEP em texto ──
  function extractCEP(text) {
    const match = String(text).match(/\b\d{5}-?\d{3}\b/);
    return match ? match[0] : null;
  }

  // ── API Pública ──
  return {
    getUserLocation,
    reverseGeocode,
    findNearbyFacilities,
    lookupCEP,
    extractCEP,
    formatDistance,
    get userLocation() { return _userLocation; }
  };
})();
