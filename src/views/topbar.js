// 顶栏：日期、主题切换、重置
import { resetDay as resetDayAction } from '../store/store.js';
import { setTheme } from '../store/storage.js';
import { render } from './render.js';

export function initTopbar() {
  document.getElementById('dateLabel').textContent = new Date().toLocaleDateString('zh-CN',{
    month:'long',day:'numeric',weekday:'short'
  }).toUpperCase();

  // 同步主题按钮图标
  const t = document.documentElement.dataset.theme || 'dark';
  document.getElementById('themeBtn').textContent = t === 'light' ? '🌑' : '☀️';
}

export function toggleTheme() {
  const h = document.documentElement;
  const goLight = h.dataset.theme !== 'light';
  h.dataset.theme = goLight ? 'light' : 'dark';
  setTheme(h.dataset.theme);
  document.getElementById('themeBtn').textContent = goLight ? '🌑' : '☀️';
}

export function resetDay() {
  if (!confirm('重置今日进度？（自定义事件也会清除）')) return;
  resetDayAction();
  render();
}
