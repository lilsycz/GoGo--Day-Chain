// 文字和时间格式化

export function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

// 08:05
export function fmtTime(ts) {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

// 19 分钟 / 1 小时 5 分
export function fmtDur(ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m} 分钟`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} 小时 ${r} 分` : `${h} 小时`;
}

// '2026-10-25' → 10月25日周六
export function fmtDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m-1, d).toLocaleDateString('zh-CN', { month:'long', day:'numeric', weekday:'short' });
}
