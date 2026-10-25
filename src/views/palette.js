// 左侧事件调板 + 新建自定义事件弹窗
// → Swift: Views/PaletteView.swift

import { PAL_TEMPLATES } from '../models/defaults.js';
import {
  customTemplates, genId, insertAfterCurrent,
  addCustomTemplate, deleteCustomTemplate,
} from '../store/store.js';
import { render } from './render.js';

let drawer, back;
let touchX0 = 0, drawerX = 0;

export function renderPalette() {
  document.getElementById('paletteGrid').innerHTML = PAL_TEMPLATES.map(t =>
    `<div class="pal-tile" onclick="addFromPalette('${t.templateId}')">
      <span class="pt-icon">${t.icon}</span>
      <span class="pt-name">${t.title}</span>
    </div>`
  ).join('');

  document.getElementById('customGrid').innerHTML = customTemplates.map(t =>
    `<div class="pal-tile" onclick="addCustomFromPalette('${t.id}')">
      <button class="pt-del" onclick="event.stopPropagation();delCustomTemplate('${t.id}')">×</button>
      <span class="pt-icon">${t.icon}</span>
      <span class="pt-name">${t.title}</span>
    </div>`
  ).join('');
}

// ── 抽屉开关 ──
export function openPalette() {
  drawer.classList.add('open');
  back.classList.add('on');
  renderPalette();
}
export function closePalette() {
  drawer.classList.remove('open');
  back.classList.remove('on');
  drawer.style.transform = '';
}

// ── 加入任务链 ──
function insertTask(task) {
  const at = insertAfterCurrent(task);
  closePalette(); render();
  setTimeout(() => {
    const rows = document.querySelectorAll('#chainList .task-row');
    if (rows[at]) rows[at].scrollIntoView({behavior:'smooth',block:'center'});
  }, 100);
}

export function addFromPalette(templateId) {
  const tmpl = PAL_TEMPLATES.find(t=>t.templateId===templateId);
  if (!tmpl) return;
  insertTask({ id:templateId+'_'+genId(), icon:tmpl.icon, title:tmpl.title, hint:null, type:'palette', btnLabel:tmpl.btnLabel });
}

export function addCustomFromPalette(customId) {
  const tmpl = customTemplates.find(t=>t.id===customId);
  if (!tmpl) return;
  insertTask({ id:'cust_'+genId(), icon:tmpl.icon, title:tmpl.title, hint:null, type:'palette', btnLabel:tmpl.btnLabel });
}

// ── 自定义事件弹窗 ──
export function openCustomModal() {
  document.getElementById('ci').value = '';
  document.getElementById('ct').value = '';
  document.getElementById('cl').value = '';
  document.getElementById('customModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('ct').focus(), 100);
}
export function closeCustomModal() { document.getElementById('customModal').classList.add('hidden'); }

export function saveCustomTemplate() {
  const icon  = document.getElementById('ci').value.trim() || '📌';
  const title = document.getElementById('ct').value.trim();
  const label = document.getElementById('cl').value.trim() || '完成了';
  if (!title) { document.getElementById('ct').focus(); return; }
  addCustomTemplate({ icon, title, btnLabel:label });
  closeCustomModal(); renderPalette();
}

export function delCustomTemplate(id) {
  deleteCustomTemplate(id);
  renderPalette();
}

// ── 初始化：左滑关闭、点弹窗外部关闭 ──
export function initPalette() {
  drawer = document.getElementById('palDrawer');
  back   = document.getElementById('backdrop');

  drawer.addEventListener('touchstart', e => {
    touchX0 = e.touches[0].clientX;
    drawerX  = 0;
  }, {passive:true});

  drawer.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - touchX0;
    if (dx < 0) {
      drawerX = dx;
      drawer.style.transform = `translateX(${dx}px)`;
      const pct = Math.max(0, 1 + dx/210);
      back.style.opacity = pct;
    }
  }, {passive:true});

  drawer.addEventListener('touchend', () => {
    if (drawerX < -60) { closePalette(); }
    else { drawer.style.transform = ''; back.style.opacity = ''; }
    drawerX = 0;
  });

  const modal = document.getElementById('customModal');
  modal.addEventListener('click', e => {
    if (e.target === modal) closeCustomModal();
  });
}
