// Każdy motyw: nazwa + kolory. Zmieniamy zmienne CSS Discorda (stare i nowe nazwy).
const THEMES = [
  { id: 'discord', name: 'Discord (domyślny)', c: null },
  { id: 'blue', name: 'Niebieski', c: { b1: '#0d2240', b2: '#0a1a33', b3: '#07122a', hi: '#16335c', accent: '#3b82f6', text: '#e6f0ff', muted: '#8fb0dc' } },
  { id: 'nitro', name: 'Nitro (fiolet + róż)', c: { b1: '#1e1236', b2: '#170d2a', b3: '#0f0720', hi: '#2f1c52', accent: '#d96bff', text: '#fdeeff', muted: '#c3a3e6' }, glow: '#ff73fa' },
  { id: 'mono', name: 'MONO (czarno-biały)', c: { b1: '#0b0b0b', b2: '#050505', b3: '#000000', hi: '#1c1c1c', accent: '#ffffff', text: '#f2f2f2', muted: '#9a9a9a' } },
  { id: 'red', name: 'Czerwony', c: { b1: '#240d12', b2: '#1a080c', b3: '#120508', hi: '#3a141c', accent: '#ef4444', text: '#ffeaea', muted: '#d19a9a' } },
  { id: 'green', name: 'Zielony (matrix)', c: { b1: '#0a1d12', b2: '#07150d', b3: '#040d08', hi: '#123222', accent: '#22c55e', text: '#e4ffee', muted: '#8fcfa5' } },
  { id: 'sakura', name: 'Sakura (róż)', c: { b1: '#2b1424', b2: '#210f1b', b3: '#170913', hi: '#43213a', accent: '#ff8fbf', text: '#fff0f7', muted: '#dba6c2' } },
  { id: 'sunset', name: 'Zmierzch (pomarańcz)', c: { b1: '#241610', b2: '#1a0f0a', b3: '#120a06', hi: '#3a2316', accent: '#f59e0b', text: '#fff4e3', muted: '#d1b08a' } },
];

function buildCss(t) {
  if (!t || !t.c) return '';
  const c = t.c;
  const vars = `
  --background-primary:${c.b1} !important; --background-secondary:${c.b2} !important; --background-secondary-alt:${c.b2} !important;
  --background-tertiary:${c.b3} !important; --background-floating:${c.b3} !important; --background-accent:${c.hi} !important;
  --background-modifier-hover:${c.hi}99 !important; --background-modifier-selected:${c.hi} !important; --background-modifier-active:${c.hi} !important;
  --channeltextarea-background:${c.b2} !important; --input-background:${c.b3} !important; --chat-background:${c.b1} !important;
  --brand-experiment:${c.accent} !important; --brand-experiment-500:${c.accent} !important; --brand-500:${c.accent} !important;
  --text-normal:${c.text} !important; --text-muted:${c.muted} !important; --header-primary:${c.text} !important; --header-secondary:${c.muted} !important;
  --interactive-normal:${c.muted} !important; --interactive-hover:${c.text} !important; --interactive-active:${c.text} !important;
  --text-link:${c.accent} !important; --scrollbar-thin-thumb:${c.accent} !important;
  --background-base-lowest:${c.b3} !important; --background-base-lower:${c.b2} !important; --background-base-low:${c.b2} !important;
  --background-surface-high:${c.b1} !important; --background-surface-higher:${c.hi} !important; --background-surface-highest:${c.hi} !important;
  --chat-background-default:${c.b1} !important; --background-mod-subtle:${c.hi}66 !important; --background-mod-normal:${c.hi}99 !important; --background-mod-strong:${c.hi} !important;
  --bg-brand:${c.accent} !important; --text-default:${c.text} !important; --text-strong:${c.text} !important; --interactive-icon-default:${c.muted} !important;`;
  let css = `:root, .theme-dark, .theme-light, .theme-darker, .theme-midnight, html, body { ${vars} }
  ::selection { background:${c.accent}66; }
  ::-webkit-scrollbar-thumb { background:${c.accent} !important; border-radius:8px; }
  ::-webkit-scrollbar-track { background:transparent !important; }`;
  if (t.glow) css += `
  @keyframes dsPulse { 0%,100% { filter: drop-shadow(0 0 4px ${t.glow}88);} 50% { filter: drop-shadow(0 0 10px ${t.glow}); } }
  [class*="selected"] [class*="pill"], [class*="avatarWrapper"] img { animation: dsPulse 3s ease-in-out infinite; }
  body { background: linear-gradient(135deg, ${c.b3}, #2a0f4a 55%, #4a1250) !important; }`;
  return css;
}
module.exports = { THEMES, buildCss };
