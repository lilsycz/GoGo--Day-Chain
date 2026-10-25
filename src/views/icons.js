// 内联 SVG 图标（线条风格，颜色跟随 currentColor）
const svg = (w, h, inner, sw = 1.6) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const I = {
  check:    svg(12, 9, `<polyline points="1,4.5 4.5,8 11,1"/>`, 1.8),
  lock:     svg(10, 12, `<rect x=".75" y="5.25" width="8.5" height="6" rx="1.5"/><path d="M2.2 5.2V3.5C2.2 2.1 3.46 1 5 1C6.54 1 7.8 2.1 7.8 3.5V5.2"/>`, 1.3),
  arrow:    svg(18, 10, `<line x1="1" y1="5" x2="16" y2="5"/><polyline points="12,1 16.5,5 12,9"/>`),
  undo:     svg(14, 14, `<path d="M3 5.5h6.5a3.5 3.5 0 0 1 0 7H6"/><polyline points="5.5,2.5 2.5,5.5 5.5,8.5"/>`),
  swap:     svg(16, 14, `<polyline points="11,1 14.5,4 11,7"/><line x1="14" y1="4" x2="2" y2="4"/><polyline points="5,7 1.5,10 5,13"/><line x1="2" y1="10" x2="14" y2="10"/>`),
  plus:     svg(14, 14, `<line x1="7" y1="1.5" x2="7" y2="12.5"/><line x1="1.5" y1="7" x2="12.5" y2="7"/>`),
  calendar: svg(18, 18, `<rect x="1.5" y="3" width="15" height="13.5" rx="3"/><line x1="1.5" y1="7.5" x2="16.5" y2="7.5"/><line x1="5.5" y1="1" x2="5.5" y2="4.5"/><line x1="12.5" y1="1" x2="12.5" y2="4.5"/>`),
  more:     `<svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor"><circle cx="2" cy="2" r="2"/><circle cx="9" cy="2" r="2"/><circle cx="16" cy="2" r="2"/></svg>`,
  close:    svg(12, 12, `<line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>`, 1.7),
};
