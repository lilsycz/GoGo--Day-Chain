// 存储层：所有 localStorage 读写都在这里
// → Swift: SwiftData / 文件存储

const DAY_KEY      = 'dc_v7';
const CUSTOM_KEY   = 'dc_custom_v1';
const DEFAULTS_KEY = 'dc_defaults_v1';
const NIGHT_KEY    = 'dc_night_v1';
const THEME_KEY    = 'dc_theme';
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

// 主题（index.html 头部也直接读这个 key，避免闪烁）
export function setTheme(t) { localStorage.setItem(THEME_KEY, t); }

// 求职 JSON 地址
export function getFeedUrl()     { return localStorage.getItem(FEED_KEY); }
export function setFeedUrl(url)  { localStorage.setItem(FEED_KEY, url); }
