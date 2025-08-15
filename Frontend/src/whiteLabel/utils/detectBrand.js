// src/whiteLabel/utils/detectBrand.js
export function detectBrand() {
  const host = window.location.hostname;
  const path = window.location.pathname;
  
  // Para desenvolvimento local, SEMPRE usar parceiroX
  if (host === '127.0.0.1' || host === 'localhost') {
    console.log('🔍 Desenvolvimento local detectado - forçando tema parceiroX');
    return 'parceiroX';
  }
  
  // Para produção, detectar por subdomain
  const subdomain = host.split('.')[0];
  const knownBrands = ['seenti', 'parceiroX'];
  return knownBrands.includes(subdomain) ? subdomain : 'seenti';
}
