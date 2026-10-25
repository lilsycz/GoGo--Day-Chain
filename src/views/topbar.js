// 顶栏：圆形日期、问候大标题、记录按钮、"···" 菜单（插入、编辑、睡前、深浅色、重置）
import { S, resetDay as resetDayAction } from '../store/store.js';
import { setTheme } from '../store/storage.js';
import { I } from './icons.js';
import { glyphSVG } from './glyphs.js';
import { confirmDialog } from './dialog.js';
import { openPalette } from './palette.js';
import { toggleEditMode } from './edit.js';
import { openBedtime } from './bedtime.js';
import { render } from './render.js';
import { renderBadge } from './calendar.js';
import { t, lang, setLang, applyStatic } from '../i18n/index.js';

// 日期显示的是"逻辑上的今天"（凌晨 4 点前还算前一天）
export function updateDateLabel() {
  renderBadge();

  const h = new Date().getHours();
  const part = h < 4 ? 'night' : h < 11 ? 'morning' : h < 13 ? 'noon' : h < 18 ? 'afternoon' : 'evening';
  document.getElementById('greeting').textContent = t('greet', { part:t('part.' + part) });
}

function syncThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.getElementById('themeLabel').textContent = t(dark ? 'menu.light' : 'menu.dark');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#121212' : '#ebe6dc';
}

// 中 / 英切换：固定文字、日期问候、整页都重画
export function toggleLang() {
  setLang(lang === 'zh' ? 'en' : 'zh');
  applyStatic();
  syncThemeLabel();
  updateDateLabel();
  render();
}

export function initTopbar() {
  applyStatic();
  // 按钮里的线条图标
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = I[el.dataset.icon] || ''; });
  document.querySelectorAll('[data-glyph]').forEach(el => { el.innerHTML = glyphSVG(el.dataset.glyph, 16); });
  updateDateLabel();
  syncThemeLabel();
  const menu = document.getElementById('menuModal');
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
}

export function toggleTheme() {
  const h = document.documentElement;
  h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(h.dataset.theme);
  syncThemeLabel();
}

export async function resetDay() {
  const ok = await confirmDialog({
    title: t('reset.title'),
    body: t('reset.body'),
    ok: t('reset.ok'), danger: true,
  });
  if (!ok) return;
  resetDayAction();
  render();
}

// ── 菜单 ──
export function openMenu()  { document.getElementById('menuModal').classList.remove('hidden'); }
export function closeMenu() { document.getElementById('menuModal').classList.add('hidden'); }

export function menuAction(what) {
  closeMenu();
  if (what === 'insert')  openPalette();
  if (what === 'edit')    toggleEditMode();
  if (what === 'bedtime') openBedtime();
  if (what === 'theme')   toggleTheme();
  if (what === 'lang')    toggleLang();
  if (what === 'reset')   resetDay();
}
