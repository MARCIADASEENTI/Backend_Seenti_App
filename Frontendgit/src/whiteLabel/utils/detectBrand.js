// src/whiteLabel/utils/detectBrand.js
export function detectBrand() {
  const host = window.location.hostname;
  const subdomain = host.split('.')[0];

  const knownBrands = ['seenti', 'parceiroX'];
  return knownBrands.includes(subdomain) ? subdomain : 'seenti';
}
