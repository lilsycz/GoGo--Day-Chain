// 任务的线条图标（24×24，描边 1.6，颜色跟随文字）
// 任务数据里可以存 glyph 名字；老数据只有 emoji 的，按下面的表自动换成对应图标
// → Swift: 换成 SF Symbols

const P = {
  bowl:      `<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M9 3.5c-.8 1.2.8 2.3 0 3.5"/><path d="M14 3.5c-.8 1.2.8 2.3 0 3.5"/>`,
  bag:       `<rect x="5" y="7" width="14" height="14" rx="4"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/><path d="M9 14h6"/>`,
  book:      `<path d="M12 7v13"/><path d="M3 5h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v12h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3z"/>`,
  box:       `<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M3 13h18"/><path d="M9 8V6h6v2"/>`,
  briefcase: `<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 13h18"/>`,
  laptop:    `<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2.5 19h19"/>`,
  dumbbell:  `<path d="M6.5 7v10"/><path d="M17.5 7v10"/><path d="M3.5 9.5v5"/><path d="M20.5 9.5v5"/><path d="M6.5 12h11"/>`,
  plate:     `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>`,
  pill:      `<rect x="2.6" y="8.5" width="18.8" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>`,
  people:    `<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14.6a4.5 4.5 0 0 1 5 4.4"/>`,
  phone:     `<path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>`,
  fish:      `<path d="M3 12c3.5-5.5 10-6 14 0-4 6-10.5 5.5-14 0z"/><path d="M17 12l4-3.5v7z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/>`,
  cup:       `<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5v2.5"/><path d="M12 3.5v2.5"/>`,
  train:     `<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 10h12"/><path d="M9 21l1.5-4"/><path d="M15 21l-1.5-4"/><circle cx="9.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="14.5" cy="13.5" r=".6" fill="currentColor"/>`,
  cart:      `<path d="M3 4h2.2l2.3 11h10.3l2.2-8H6.3"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>`,
  chat:      `<path d="M4 5h16v11H10l-6 4z"/>`,
  moon:      `<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`,
  lotus:     `<circle cx="12" cy="5" r="2"/><path d="M12 9.5v4.5"/><path d="M7 11.5l5 2.5 5-2.5"/><path d="M4 20c2.5-1.5 5-2 8-2s5.5.5 8 2"/>`,
  glasses:   `<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14h4"/><path d="M3 14l1.5-6"/><path d="M21 14l-1.5-6"/>`,
  music:     `<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>`,
  pen:       `<path d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M14 6.5l3 3"/>`,
  heart:     `<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z"/>`,
  sun:       `<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>`,
  home:      `<path d="M4 10.5L12 4l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>`,
  leaf:      `<path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15z"/><path d="M5 19l8-8"/>`,
  walk:      `<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6-2.5-3 1.5-4.5 4 3h3"/><path d="M9.5 12L7 14"/><path d="M12 15l3 6"/>`,
  shower:    `<path d="M5 20V8a4 4 0 0 1 8 0"/><path d="M10 8h6"/><path d="M11.5 12v1.5M14.5 12v1.5M13 15.5V17M10 15.5V17M16 15.5V17"/>`,
  pin:       `<path d="M12 21s6-6.2 6-11a6 6 0 0 0-12 0c0 4.8 6 11 6 11z"/><circle cx="12" cy="10" r="2.2"/>`,
  dot:       `<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`,
};

// 老数据里的 emoji → 图标名
const EMOJI = {
  '🥣':'bowl', '🎒':'bag', '📚':'book', '🍱':'box', '💼':'briefcase',
  '🖥':'laptop', '💻':'laptop', '🏋':'dumbbell', '🏋️':'dumbbell', '🍽':'plate', '💊':'pill',
  '📋':'people', '📞':'phone', '🐟':'fish', '☕':'cup', '🚇':'train', '🛒':'cart',
  '💬':'chat', '😴':'moon', '🧘':'lotus', '📖':'glasses', '🎸':'music', '🎵':'music',
  '✏':'pen', '📝':'pen', '❤':'heart', '☀':'sun', '🏠':'home', '🌿':'leaf', '🚶':'walk',
  '🚿':'shower', '📌':'pin',
};

// 新建事件时可以挑的图标
export const GLYPH_CHOICES = Object.keys(P).filter(k => k !== 'dot');

export function glyphName(t) {
  if (t.glyph && P[t.glyph]) return t.glyph;
  const e = String(t.icon || '').replace(/️/g, '');
  return EMOJI[e] || 'dot';
}

export function glyphSVG(name, size = 20) {
  return `<svg class="glyph" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.dot}</svg>`;
}

// 任务（或记录里的快照）→ 图标 SVG
export function glyph(t, size = 20) {
  return glyphSVG(glyphName(t), size);
}

// 打勾清单的文字去掉开头的 emoji（"💻 电脑" → "电脑"）
export function stripEmoji(s) {
  return String(s).replace(/^[\p{Extended_Pictographic}️‍]+\s*/u, '');
}
