// 左侧事件调板 + 新建自定义事件弹窗
// → Swift: Views/PaletteView.swift

import { PAL_TEMPLATES } from '../models/defaults.js';
import { CATEGORIES } from '../models/categories.js';
import { glyph, glyphSVG, glyphName, GLYPH_CHOICES } from './glyphs.js';
import {
  customTemplates, genId, insertAfterCurrent,
  addCustomTemplate, deleteCustomTemplate,
} from '../store/store.js';
import { render } from './render.js';
import { t, loc } from '../i18n/index.js';
import { esc } from './format.js';

let drawer, back;
let pickedGlyph = 'pin';
let touchX0 = 0, drawerX = 0;

export function renderPalette() {
  document.getElementById('paletteGrid').innerHTML = PAL_TEMPLATES.map(tp =>
    `<div class="pal-tile" onclick="addFromPalette('${tp.templateId}')">
      <span class="pt-icon">${glyph(tp, 24)}</span>
      <span class="pt-name">${esc(loc(tp.templateId, 'title', tp.title))}</span>
    </div>`
  ).join('');

  document.getElementById('customGrid').innerHTML = customTemplates.map(tp =>
    `<div class="pal-tile" onclick="addCustomFromPalette('${tp.id}')">
      <button class="pt-del" onclick="event.stopPropagation();delCustomTemplate('${tp.id}')">×</button>
      <span class="pt-icon">${glyph(tp, 24)}</span>
      <span class="pt-name">${esc(tp.title)}</span>
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
  insertTask({ id:templateId+'_'+genId(), cat:tmpl.cat, icon:tmpl.icon, glyph:glyphName(tmpl), title:tmpl.title, hint:null, type:'palette', btnLabel:tmpl.btnLabel, once:true });
}

export function addCustomFromPalette(customId) {
  const tmpl = customTemplates.find(t=>t.id===customId);
  if (!tmpl) return;
  insertTask({ id:'cust_'+genId(), cat:tmpl.cat||'other', icon:tmpl.icon||'', glyph:glyphName(tmpl), title:tmpl.title, hint:null, starter:tmpl.starter||'', type:'palette', btnLabel:tmpl.btnLabel, once:true });
}

// ── 自定义事件弹窗 ──
export function openCustomModal() {
  pickedGlyph = 'pin';
  renderGlyphPicker();
  document.getElementById('ct').value = '';
  document.getElementById('cl').value = '';
  document.getElementById('cs').value = '';
  document.getElementById('ccat').innerHTML = Object.entries(CATEGORIES)
    .map(([k, c]) => `<option value="${k}"${k==='other'?' selected':''}>${t('cat.' + k)}</option>`).join('');
  document.getElementById('customModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('ct').focus(), 100);
}
function renderGlyphPicker() {
  document.getElementById('cg').innerHTML = GLYPH_CHOICES.map(name =>
    `<button type="button" class="gp-item${name === pickedGlyph ? ' on' : ''}" onclick="pickGlyph('${name}')" aria-label="${name}">${glyphSVG(name, 22)}</button>`
  ).join('');
}

export function pickGlyph(name) { pickedGlyph = name; renderGlyphPicker(); }

export function closeCustomModal() { document.getElementById('customModal').classList.add('hidden'); }

export function saveCustomTemplate() {
  const title = document.getElementById('ct').value.trim();
  const label = document.getElementById('cl').value.trim(); // 空着就显示「完成 / Done」
  const starter = document.getElementById('cs').value.trim();
  const cat   = document.getElementById('ccat').value || 'other';
  if (!title) { document.getElementById('ct').focus(); return; }
  addCustomTemplate({ glyph:pickedGlyph, title, btnLabel:label, starter, cat });
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
