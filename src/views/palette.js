// 插入托盘（编辑模式底部）+ 新建事件弹窗
// 托盘三种高度：peek（只露标题）/ half / full，上滑展开、下滑收起、点标题切换
// 点一下：加在当前任务后面；按住拖到上面的任务链里：插在放下的位置
// 插入后留在编辑页：新的一行闪一下、滚到它，底部提示插在了哪，可以撤销
// → Swift: Views/InsertTray.swift（拖拽用 .draggable / .dropDestination）

import { PAL_TEMPLATES } from '../models/defaults.js';
import { CATEGORIES, catColor } from '../models/categories.js';
import { glyph, glyphSVG, glyphName, GLYPH_CHOICES } from './glyphs.js';
import {
  S, customTemplates, genId, insertAfterCurrent, insertBefore,
  addCustomTemplate, deleteCustomTemplate, removeTask, restoreTask,
} from '../store/store.js';
import { render } from './render.js';
import { t, tt, loc } from '../i18n/index.js';
import { esc } from './format.js';
import { editMode, toggleEditMode } from './edit.js';
import { showToast } from './toast.js';
import { seen, markSeen } from '../store/storage.js';

let tray;
let state = 'closed';        // closed / peek / half / full
let beforeDrag = 'half';
let pickedGlyph = 'pin';
let pickedCat = 'other';
let traySortables = [];

export const trayOpen = () => state !== 'closed';

export function setTray(next) {
  state = next;
  tray.dataset.state = next;
  document.body.dataset.tray = next;
}

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
  if (!trayOpen() || typeof Sortable === 'undefined') return;
  document.querySelectorAll('#palSections .pal-grid').forEach(grid => {
    try {
      traySortables.push(new Sortable(grid, {
        group: { name:'palette', pull:'clone', put:false },
        sort: false,
        forceFallback: true, fallbackOnBody: true,
        delay: 120, delayOnTouchOnly: true, // 手机上让托盘还能上下滑
        filter: '.pt-del', preventOnFilter: false,
        // 拖起来时托盘缩到最小，把上面的列表让出来
        onStart() { beforeDrag = state; setTray('peek'); document.body.classList.add('dragging-tile'); },
        onEnd(evt) {
          document.body.classList.remove('dragging-tile');
          if (evt.to === evt.from) setTray(beforeDrag); // 没放进列表：恢复原来的高度
        },
      }));
    } catch (e) { console.warn('Tray sortable failed', e); }
  });
}

// ── 托盘开关 ──
// 从主页的"插入一件"等按钮进来：先进编辑模式，再把托盘拉到半屏
export function openPalette() {
  if (!editMode) toggleEditMode();
  setTray('half');
  renderPalette();
}
export function closePalette() { setTray('peek'); }

// 进 / 出编辑模式时由 edit.js 调用
export function onEditMode(on) {
  setTray(on ? 'peek' : 'closed');
  // 第一次出现：往上弹一下，提示可以拉上来
  if (on && !seen('tray')) {
    markSeen('tray');
    setTimeout(() => tray.classList.add('hint-bounce'), 700);
    setTimeout(() => tray.classList.remove('hint-bounce'), 2100);
  }
}

const ORDER = ['peek', 'half', 'full'];
function stepTray(dir) {
  const i = ORDER.indexOf(state);
  setTray(ORDER[Math.max(0, Math.min(ORDER.length - 1, i + dir))]);
}

// 插入之后：滚到新的一行、闪一下，提示插在哪，可以撤销
function afterInsert(task, at) {
  document.body.classList.remove('dragging-tile');
  setTray('peek');
  render();
  const row = document.querySelector(`#chainList .task-row[data-id="${task.id}"]`);
  if (row) {
    row.classList.add('just-added');
    row.scrollIntoView({ behavior:'smooth', block:'center' });
  }
  const prev = S.chain[at - 1];
  const title = esc(tt(task, 'title'));
  const msg = prev
    ? t('toast.insertedAfter', { t:title, after:esc(tt(prev, 'title')) })
    : t('toast.insertedFirst', { t:title });
  showToast(msg, t('undo'), () => {
    const undo = removeTask(task.id);
    if (undo) render();
  });
}

// 点一下：加在当前任务后面
export function addTpl(tpl) {
  const task = taskFromTpl(tpl);
  if (!task) return;
  afterInsert(task, insertAfterCurrent(task));
}

// 拖进任务链：插在 beforeId 前面（chain.js 收到放下事件时调用）
export function dropTpl(tpl, beforeId) {
  const task = taskFromTpl(tpl);
  if (!task) return;
  afterInsert(task, insertBefore(task, beforeId));
}

// ── 新建事件弹窗 ──
export function openCustomModal() {
  pickedGlyph = 'pin';
  pickedCat = 'other';
  renderGlyphPicker();
  renderCatPicker();
  document.getElementById('ct').value = '';
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
  if (!title) { document.getElementById('ct').focus(); return; }
  // 第一步休息时再写；按钮文字默认「完成」
  addCustomTemplate({ glyph:pickedGlyph, title, btnLabel:'', starter:'', cat:pickedCat });
  closeCustomModal(); renderPalette();
}

export function delCustomTemplate(id) {
  deleteCustomTemplate(id);
  renderPalette();
}

export function initPalette() {
  tray = document.getElementById('palDrawer');

  // 标题栏：点一下在收起 / 半屏之间切换；上滑展开、下滑收起
  const head = document.getElementById('trayHead');
  let y0 = null, moved = false;
  head.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; moved = false; }, { passive:true });
  head.addEventListener('touchmove', e => {
    if (y0 == null) return;
    const dy = e.touches[0].clientY - y0;
    if (Math.abs(dy) > 30) { stepTray(dy < 0 ? 1 : -1); y0 = null; moved = true; }
  }, { passive:true });
  head.addEventListener('touchend', () => { y0 = null; });
  head.addEventListener('click', () => {
    if (moved) { moved = false; return; }
    setTray(state === 'peek' ? 'half' : 'peek');
  });
  // 托盘内容区往上滑到顶时也展开成大半屏
  tray.querySelector('.pal-body').addEventListener('scroll', e => {
    if (state === 'half' && e.target.scrollTop > 40) setTray('full');
  }, { passive:true });

  const modal = document.getElementById('customModal');
  modal.addEventListener('click', e => {
    if (e.target === modal) closeCustomModal();
  });
}
