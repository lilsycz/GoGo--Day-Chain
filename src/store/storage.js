// 存储层：所有 localStorage 读写都在这里
// → Swift: SwiftData / 文件存储

const DAY_KEY      = 'dc_v7';
const CUSTOM_KEY   = 'dc_custom_v1';
const DEFAULTS_KEY = 'dc_defaults_v1';
const NIGHT_KEY    = 'dc_night_v1';
const HISTORY_KEY  = 'dc_history_v1';
const TEMPLATES_KEY = 'dc_templates_v1';
const ACTIVE_TPL_KEY = 'dc_active_tpl';
const THEME_KEY    = 'dc_theme2'; // 新风格从浅色开始
const FEED_KEY     = 'job_feed_url';

// 当天状态（解析失败会抛错，由调用方处理）
export function loadDay()   { return JSON.parse(localStorage.getItem(DAY_KEY)); }
export function saveDay(s)  { localStorage.setItem(DAY_KEY, JSON.stringify(s)); }

// 用户调整过的任务链（作为每天的模板）
export function loadDefaultChain() {
  try { const d = localStorage.getItem(DEFAULTS_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
export function saveDefaultChain(chain) { localStorage.setItem(DEFAULTS_KEY, JSON.stringify(chain)); }

// 自定义调板事件
export function loadCustomTemplates() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; } catch { return []; }
}
export function saveCustomTemplates(list) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); }

// 睡前清单条目
export function loadNightItems() {
  try { const d = localStorage.getItem(NIGHT_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
export function saveNightItems(list) { localStorage.setItem(NIGHT_KEY, JSON.stringify(list)); }

// 往日记录（最新的在前）
export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
export function saveHistory(list) { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); }

// 主题（index.html 头部也直接读这个 key，避免闪烁）
export function setTheme(t) { localStorage.setItem(THEME_KEY, t); }

// 界面语言（'zh' / 'en'，没设过是 null）
// 用过旧版（只有中文）的人：已经有当天数据
export function hasSavedDay() { try { return !!localStorage.getItem(DAY_KEY); } catch { return false; } }
export function getLang() { try { return localStorage.getItem('dc_lang'); } catch { return null; } }
export function setLang(l) { try { localStorage.setItem('dc_lang', l); } catch {} }

// 存下来的模版 [{ id, name, chain }]；null = 还没迁移过
export function loadTemplates() {
  try { const d = localStorage.getItem(TEMPLATES_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
export function saveTemplates(list) { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list)); }
export function getActiveTemplate()   { return localStorage.getItem(ACTIVE_TPL_KEY); }
export function setActiveTemplate(id) { if (id) localStorage.setItem(ACTIVE_TPL_KEY, id); else localStorage.removeItem(ACTIVE_TPL_KEY); }
export function hasNightItems() { return localStorage.getItem(NIGHT_KEY) != null; }

// 一次性的小标记（比如新手动作提示看过没有）
export function seen(key)    { try { return localStorage.getItem('dc_seen_' + key) === '1'; } catch { return true; } }
export function markSeen(key){ try { localStorage.setItem('dc_seen_' + key, '1'); } catch {} }

// ── 备份：把所有数据打包成一个对象 / 从备份恢复 ──
const BACKUP_KEYS = [DAY_KEY, CUSTOM_KEY, DEFAULTS_KEY, NIGHT_KEY, HISTORY_KEY, TEMPLATES_KEY, ACTIVE_TPL_KEY, THEME_KEY, 'dc_lang', FEED_KEY];

export function exportAll() {
  const data = {};
  for (const k of BACKUP_KEYS) { const v = localStorage.getItem(k); if (v != null) data[k] = v; }
  return { app:'gogo-day-chain', version:1, exportedAt:new Date().toISOString(), data };
}

// 返回 false 表示文件不对
export function importAll(backup) {
  if (!backup || backup.app !== 'gogo-day-chain' || typeof backup.data !== 'object') return false;
  for (const k of BACKUP_KEYS) localStorage.removeItem(k);
  for (const [k, v] of Object.entries(backup.data)) if (BACKUP_KEYS.includes(k)) localStorage.setItem(k, v);
  return true;
}

// 求职 JSON 地址
export function getFeedUrl()     { return localStorage.getItem(FEED_KEY); }
export function setFeedUrl(url)  { localStorage.setItem(FEED_KEY, url); }
