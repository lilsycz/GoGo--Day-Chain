// 多语言：中文 / English
// t('key', {变量})  取界面文字
// tt(task, 'title') 取任务文字：默认任务跟着语言变，用户改过的原样显示
// → Swift: String(localized:) + Localizable.xcstrings

import zh from './zh.js';
import en from './en.js';
import { DEFAULT_TEXT } from './defaults.js';
import { getLang as loadLang, setLang as saveLang, hasSavedDay } from '../store/storage.js';

const DICTS = { zh, en };

function detect() {
  const saved = loadLang();
  if (saved === 'zh' || saved === 'en') return saved;
  if (hasSavedDay()) return 'zh'; // 老用户之前一直是中文，不突然换
  return String(navigator.language || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export let lang = detect();

export function setLang(l) {
  lang = l;
  saveLang(l);
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
}

export function t(key, vars = {}) {
  const s = DICTS[lang][key] ?? DICTS.zh[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

// 默认文字 → 当前语言；不是默认值就原样返回
export function loc(id, field, value) {
  if (value == null || value === '') return value;
  const base = String(id).replace(/([_~]\d+)+$/, '');
  const entry = DEFAULT_TEXT[base]?.[field];
  if (!entry) return value;
  const hit = (Array.isArray(entry) ? entry : [entry]).find(v => value === v.zh || value === v.en);
  return hit ? hit[lang] : value;
}

// 休息时"写下第一步"的灰色例子：内置任务有自己的例子，其他用通用的
export function exampleFor(task) {
  const base = String(task.id).replace(/([_~]\d+)+$/, '');
  return DEFAULT_TEXT[base]?.example?.[lang] || t('step.example');
}

export const tt = (task, field) => loc(task.id, field, task[field]);

// index.html 里的固定文字：data-i18n（文字）、data-i18n-ph（占位）、data-i18n-aria（无障碍名称）
export function applyStatic() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
}
