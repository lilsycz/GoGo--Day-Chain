// 插入托盘（底部升起）+ 新建事件弹窗
// 点一下：加在当前任务后面；按住拖到上面的任务链里：插在放下的位置
// → Swift: Views/InsertTray.swift（拖拽用 .draggable / .dropDestination）

import { PAL_TEMPLATES } from '../models/defaults.js';
import { CATEGORIES, catColor } from '../models/categories.js';
import { glyph, glyphSVG, glyphName, GLYPH_CHOICES } from './glyphs.js';
import {
  customTemplates, genId, insertAfterCurrent, insertBefore,
  addCustomTemplate, deleteCustomTemplate,
} from '../store/store.js';
import { render } from './render.js';
import { t, loc } from '../i18n/index.js';
import { esc } from './format.js';

let tray;
let open = false;
let pickedGlyph = 'pin';
let pickedCat = 'other';
let traySortables = [];

export const isInserting = () => open;

// ── 模板 → 任务 ──
// tpl: 't:meeting'（自带模板） / 'c:ct_123'（自定义）
function taskFromTpl(tpl) {
  const [kind, id] = tpl.split(':');
  if (kind === 't') {
    const tp = PAL_TEMPLATES.find(x => x.templateId === id);
    return tp && { id:id+'_'+genId(), cat:tp.cat, icon:tp.icon, glyph:glyphName(tp), title:tp.title, hint:null, type:'palette', btnLabel:tp.btnLabel, once:true };
  }
  const tp = customTemplates.find(x => x.id === id);
  return tp && { id:'cust_'+genId(), cat:tp.cat||'other', icon:tp.icon||'', glyph:glyphName(tp), title:tp.title, hint:null, starter:tp.starter||'', type:'palette', btnLabel:tp.btnLabel, once:true };
}

function tileHTML(tpl, tp, title, deletable) {
  return `<div class="pal-tile" data-tpl="${tpl}" style="--c:${catColor(tp.cat || 'other')}" onclick="addTpl('${tpl}')">
    ${deletable ? `<button class="pt-del" onclick="event.stopPropagation();delCustomTemplate('${tp.id}')" aria-label="${t('remove')}">×</button>` : ''}
    <span class="pt-icon">${glyph(tp, 24)}</span>
    <span class="pt-name">${esc(title)}</span>
  </div>`;
}

// 按类别分组：每组一个色点标题 + 一排圆
export function renderPalette() {
  const box = document.getElementById('palSections');
  if (!box) return;
  const groups = Object.keys(CATEGORIES).map(cat => {
    const tiles = [
      ...PAL_TEMPLATES.filter(tp => (tp.cat || 'other') === cat)
        .map(tp => tileHTML('t:' + tp.templateId, tp, loc(tp.templateId, 'title', tp.title), false)),
      ...customTemplates.filter(tp => (tp.cat || 'other') === cat)
        .map(tp => tileHTML('c:' + tp.id, tp, tp.title, true)),
    ];
    if (!tiles.length) return '';
    return `<div class="pal-group">
      <div class="pal-sec"><i style="background:${catColor(cat)}"></i>${t('cat.' + cat)}</div>
      <div class="pal-grid">${tiles.join('')}</div>
    </div>`;
  }).join('');
  box.innerHTML = groups;
  initTraySortables();
}

// 托盘里的圆可以拖出去（复制一份），自己不排序
function initTraySortables() {
  traySortables.forEach(s => { try { s.destroy(); } catch {} });
  traySortables = [];
  if (!open || typeof Sortable === 'undefined') return;
  document.querySelectorAll('#palSections .pal-grid').forEach(grid => {
    try {
      traySortables.push(new Sortable(grid, {
        group: { name:'palette', pull:'clone', put:false },
        sort: false,
        forceFallback: true, fallbackOnBody: true,
        delay: 120, delayOnTouchOnly: true, // 手机上让托盘还能上下滑
        filter: '.pt-del', preventOnFilter: false,
        onStart() { document.body.classList.add('dragging-tile'); },
        onEnd()   { document.body.classList.remove('dragging-tile'); },
      }));
    } catch (e) { console.warn('Tray sortable failed', e); }
  });
}

// ── 托盘开关：打开时上面的任务链会展开，方便拖进去 ──
export function openPalette() {
  open = true;
  document.body.classList.add('inserting');
  tray.classList.add('open');
  render();
}
export function closePalette() {
  if (!open) return;
  open = false;
  document.body.classList.remove('inserting');
  tray.classList.remove('open');
  render();
}

function scrollToRow(at) {
  setTimeout(() => {
    const rows = document.querySelectorAll('#chainList .task-row');
    if (rows[at]) rows[at].scrollIntoView({ behavior:'smooth', block:'center' });
  }, 100);
}

// 点一下：加在当前任务后面
export function addTpl(tpl) {
  const task = taskFromTpl(tpl);
  if (!task) return;
  const at = insertAfterCurrent(task);
  closePalette();
  scrollToRow(at);
}

// 拖进任务链：插在 beforeId 前面（chain.js 收到放下事件时调用）
export function dropTpl(tpl, beforeId) {
  const task = taskFromTpl(tpl);
  if (!task) return;
  const at = insertBefore(task, beforeId);
  closePalette();
  scrollToRow(at);
}

// ── 新建事件弹窗 ──
export function openCustomModal() {
  pickedGlyph = 'pin';
  pickedCat = 'other';
  renderGlyphPicker();
  renderCatPicker();
  document.getElementById('ct').value = '';
  document.getElementById('cl').value = '';
  document.getElementById('cs').value = '';
  document.getElementById('customModal').classList.remove('hidden');
  setTimeout(()=>document.getElementById('ct').focus(), 100);
}

function renderGlyphPicker() {
  document.getElementById('cg').innerHTML = GLYPH_CHOICES.map(name =>
    `<button type="button" class="gp-item${name === pickedGlyph ? ' on' : ''}" onclick="pickGlyph('${name}')" aria-label="${name}">${glyphSVG(name, 22)}</button>`
  ).join('');
}
export function pickGlyph(name) { pickedGlyph = name; renderGlyphPicker(); }

// 类别：一排带色点的按钮
function renderCatPicker() {
  document.getElementById('ccat').innerHTML = Object.keys(CATEGORIES).map(k =>
    `<button type="button" class="cat-chip${k === pickedCat ? ' on' : ''}" onclick="pickCat('${k}')"><i style="background:${catColor(k)}"></i>${t('cat.' + k)}</button>`
  ).join('');
}
export function pickCat(k) { pickedCat = k; renderCatPicker(); }

export function closeCustomModal() { document.getElementById('customModal').classList.add('hidden'); }

export function saveCustomTemplate() {
  const title = document.getElementById('ct').value.trim();
  const label = document.getElementById('cl').value.trim(); // 空着就显示「完成 / Done」
  const starter = document.getElementById('cs').value.trim();
  if (!title) { document.getElementById('ct').focus(); return; }
  addCustomTemplate({ glyph:pickedGlyph, title, btnLabel:label, starter, cat:pickedCat });
  closeCustomModal(); renderPalette();
}

export function delCustomTemplate(id) {
  deleteCustomTemplate(id);
  renderPalette();
}

export function initPalette() {
  tray = document.getElementById('palDrawer');
  const modal = document.getElementById('customModal');
  modal.addEventListener('click', e => {
    if (e.target === modal) closeCustomModal();
  });
}
