export function formatarMoeda(valor) {
  const n = Number(valor) || 0;
  const [inteiro, decimal] = Math.abs(n).toFixed(2).split('.');
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${n < 0 ? '-' : ''}R$ ${comPontos},${decimal}`;
}

// Converte "3.500,50" ou "3500,5" ou "3500.50" em número
export function converterValor(texto) {
  let t = String(texto).trim().replace(/[^\d.,]/g, '');
  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.');
  }
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : NaN;
}

export function mascararData(texto) {
  const d = String(texto).replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function dataValida(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  if (ano < 1900 || ano > 2100) return false;
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

export function dataHoje() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// "DD/MM/AAAA" -> número AAAAMMDD (para ordenação)
export function chaveData(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto || '');
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}
