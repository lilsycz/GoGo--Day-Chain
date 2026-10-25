// 内联 SVG 图标（线条风格，颜色跟随 currentColor）
const svg = (w, h, inner, sw = 1.6) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const I = {
  check:    svg(12, 9, `<polyline points="1,4.5 4.5,8 11,1"/>`, 1.8),
  lock:     svg(10, 12, `<rect x=".75" y="5.25" width="8.5" height="6" rx="1.5"/><path d="M2.2 5.2V3.5C2.2 2.1 3.46 1 5 1C6.54 1 7.8 2.1 7.8 3.5V5.2"/>`, 1.3),
  arrow:    `<svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor" aria-hidden="true"><path d="M1 1.2v7.6a.8.8 0 0 0 1.2.7l6-3.8a.8.8 0 0 0 0-1.4l-6-3.8A.8.8 0 0 0 1 1.2z"/></svg>`,
  undo:     svg(14, 14, `<path d="M3 5.5h6.5a3.5 3.5 0 0 1 0 7H6"/><polyline points="5.5,2.5 2.5,5.5 5.5,8.5"/>`),
  swap:     svg(16, 14, `<polyline points="11,1 14.5,4 11,7"/><line x1="14" y1="4" x2="2" y2="4"/><polyline points="5,7 1.5,10 5,13"/><line x1="2" y1="10" x2="14" y2="10"/>`),
  plus:     svg(14, 14, `<line x1="7" y1="1.5" x2="7" y2="12.5"/><line x1="1.5" y1="7" x2="12.5" y2="7"/>`),
  calendar: svg(18, 18, `<rect x="1.5" y="3" width="15" height="13.5" rx="3"/><line x1="1.5" y1="7.5" x2="16.5" y2="7.5"/><line x1="5.5" y1="1" x2="5.5" y2="4.5"/><line x1="12.5" y1="1" x2="12.5" y2="4.5"/>`),
  more:     `<svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor"><circle cx="2" cy="2" r="2"/><circle cx="9" cy="2" r="2"/><circle cx="16" cy="2" r="2"/></svg>`,
  grip:     svg(16, 12, `<line x1="1" y1="1.5" x2="15" y2="1.5"/><line x1="1" y1="6" x2="15" y2="6"/><line x1="1" y1="10.5" x2="15" y2="10.5"/>`),
  // 实心铅笔（菜单「编辑任务」）
  editFill: `<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2.5 14.6V17.5h2.9L14.2 8.7l-2.9-2.9z"/><path d="M17.1 5.8a1 1 0 0 0 0-1.4l-1.5-1.5a1 1 0 0 0-1.4 0l-1.6 1.6 2.9 2.9z"/></svg>`,
  // 菜单用的实心图标
  plusFill:  `<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect x="8.4" y="2.5" width="3.2" height="15" rx="1.2"/><rect x="2.5" y="8.4" width="15" height="3.2" rx="1.2"/></svg>`,
  themeFill: `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 2.4a7.6 7.6 0 0 0 0 15.2z" fill="currentColor"/></svg>`,
  langFill:  `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="4.5" fill="currentColor"/><path d="M6.6 14.2L10 5.8l3.4 8.4M7.9 11.2h4.2" fill="none" stroke="var(--bg)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  moonFill:  `<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.8 12.6A7.4 7.4 0 0 1 7.4 3.2a7.4 7.4 0 1 0 9.4 9.4z"/></svg>`,
  close:    svg(12, 12, `<line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>`, 1.7),
};
