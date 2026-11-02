/**
 * Formatting and environmental accounting calculation utilities
 */

export function formatIDR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `(${formatted})` : formatted;
}

export function formatIDRShort(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  let result = '';

  if (abs >= 1_000_000_000_000) {
    result = `Rp ${(abs / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T`;
  } else if (abs >= 1_000_000_000) {
    result = `Rp ${(abs / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  } else if (abs >= 1_000_000) {
    result = `Rp ${(abs / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
  } else {
    result = formatIDR(abs);
  }

  return isNegative ? `(${result})` : result;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Pseudo cryptographic hash simulation for blockchain ledger demonstration
export function generateSimulatedHash(seed: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x55555555;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 0x01000193);
    hash2 = Math.imul(hash2 ^ (ch << 1), 0x01000193);
  }
  const part1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((hash1 ^ hash2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((hash1 + hash2) >>> 0).toString(16).padStart(8, '0');
  const part5 = ((hash1 * 3) >>> 0).toString(16).padStart(8, '0');
  const part6 = ((hash2 * 7) >>> 0).toString(16).padStart(8, '0');
  const part7 = ((hash1 ^ 0xabcdef) >>> 0).toString(16).padStart(8, '0');
  const part8 = ((hash2 ^ 0x123456) >>> 0).toString(16).padStart(8, '0');
  return `0x${part1}${part2}${part3}${part4}${part5}${part6}${part7}${part8}`;
}
