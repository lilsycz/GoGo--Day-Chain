// 文字和时间格式化
import { t, lang } from '../i18n/index.js';

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
  if (m < 60) return t('dur.min', {m});
  const h = Math.floor(m / 60), r = m % 60;
  return r ? t('dur.hm', {h, m:r}) : t('dur.h', {h});
}

// '2026-10-25' → 10月25日周六
export function fmtDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m-1, d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: lang === 'zh' ? 'long' : 'short', day:'numeric', weekday:'short' });
}
