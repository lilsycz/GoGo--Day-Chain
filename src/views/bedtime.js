// 睡前页：今天（圆环，点一下看时间轴）→ 明天（模版 + 整条任务链预览，可以直接编辑）→ 睡前清单
// 对明天的调整只管明天一次；第二天又从模版开始
// → Swift: Views/BedtimeView.swift

import {
  S, nightItems, toggleCheck, updateNightItemLabel, buildRecord,
  getTemplates, activeTemplateId, setTomorrowTemplate, tomorrowChain,
  setTomorrowStarter, updateTomorrowTask, removeTomorrowTask, reorderTomorrow, addTomorrowTask,
  customTemplates,
} from '../store/store.js';
import { PAL_TEMPLATES } from '../models/defaults.js';
import { CATEGORIES, categoryOf, catVars, catColor } from '../models/categories.js';
import { I } from './icons.js';
import { glyph, stripEmoji } from './glyphs.js';
import { loc, tt, t, exampleFor } from '../i18n/index.js';
import { esc } from './format.js';
import { startInlineEdit } from './edit.js';
import { dayRing } from './calendar.js';
import { templateName } from './templates.js';
import { stepInputHTML } from './stepInput.js';
import { taskFromTpl, openCustomModal } from './palette.js';

let sortable = null;
let sel = null; // 明天列表里选中的那一行：新加的事插在它后面

export function openBedtime(focusTomorrow = false) {
  sel = null;
  renderBedtime();
  const view = document.getElementById('bedtimeView');
  view.classList.add('active');
  view.scrollTop = 0;
  if (focusTomorrow) setTimeout(() => document.getElementById('tmrSection')?.scrollIntoView({ behavior:'smooth' }), 80);
}
export function closeBedtime() { document.getElementById('bedtimeView').classList.remove('active'); }

function tomorrowRow(task, i) {
  const step = task.starter || '';
  const stepPart = i === 0
    ? stepInputHTML(task, { tomorrow:true, value:step })
    : step
      ? `<div class="tmr-step" onclick="editTomorrowStep(event,'${task.id}')">${t('rest.firstStep', { s:esc(step) })}</div>`
      : `<div class="add-chips"><button class="add-chip" onclick="editTomorrowStep(event,'${task.id}')">${I.plus}<span>${t('field.step')}</span></button></div>`;
  return `<div class="tmr-row${i === 0 ? ' first' : ''}${task.id === sel ? ' sel' : ''}" data-id="${task.id}" style="${catVars(categoryOf(task))}" onclick="selectTomorrow('${task.id}')">
    <div class="row-top">
      <span class="dot"></span>
      <span class="row-icon">${glyph(task, 20)}</span>
      <span class="row-title tmr-title" onclick="renameTomorrow(event,'${task.id}')">${esc(tt(task, 'title'))}</span>
      <span class="row-right">
        <button class="row-del" onclick="event.stopPropagation();removeTomorrow('${task.id}')" aria-label="${t('remove')}">×</button>
        <span class="drag-handle" aria-label="${t('drag')}">${I.grip}</span>
      </span>
    </div>
    <div class="tmr-body">${stepPart}</div>
  </div>`;
}

export function renderBedtime() {
  const rec = buildRecord(S);
  const done = rec ? rec.blocks.filter(b => b.end).length : 0;
  const active = activeTemplateId();
  const chain = tomorrowChain();

  document.getElementById('bedBody').innerHTML = `
    <div class="sec-label">${t('bed.today')}</div>
    <button class="bed-today" onclick="openToday()" aria-label="${t('aria.today')}">
      <span class="bed-ring">${dayRing(rec, 72, 3)}</span>
      <span class="big-num">${done}<small>${t('log.count')}</small></span>
    </button>

    <div class="sec-label" id="tmrSection">${t('bed.tomorrow')}</div>
    <div class="tpl-chips">${getTemplates().map(tpl =>
      `<button class="cat-chip${tpl.id === active ? ' on' : ''}" onclick="pickTomorrow('${tpl.id}')">${esc(templateName(tpl))}</button>`
    ).join('')}</div>
    <div id="tmrList" class="tmr-list">${chain.map(tomorrowRow).join('')}</div>
    <button class="pal-add-btn" onclick="openTomorrowAdd()">${t('bed.add')}</button>

    <div class="sec-label">${t('bed.night')}</div>
    <div id="nightChecklist">${nightItems.map(item => {
      const chk = !!S.checks[item.id];
      return `<div class="night-row${chk?' checked':''}" data-item-id="${item.id}" onclick="toggleNight('${item.id}',this)">
        <div class="cbox">${chk?I.check:''}</div><div class="clabel">${esc(stripEmoji(loc(item.id, 'label', item.label)))}</div>
      </div>`;
    }).join('')}</div>`;

  initTomorrowSort();
}

// 拖 ≡ 给明天排序
function initTomorrowSort() {
  if (sortable) { try { sortable.destroy(); } catch {} sortable = null; }
  if (typeof Sortable === 'undefined') return;
  const el = document.getElementById('tmrList');
  sortable = new Sortable(el, {
    handle:'.drag-handle', animation:200, forceFallback:true, fallbackOnBody:true,
    onEnd(evt) {
      if (evt.oldIndex === evt.newIndex) return;
      reorderTomorrow([...el.querySelectorAll('.tmr-row')].map(r => r.dataset.id));
      setTimeout(renderBedtime, 0);
    },
  });
}

export function pickTomorrow(id) {
  setTomorrowTemplate(id);
  renderBedtime();
}

function setSel(id) {
  sel = id;
  document.querySelectorAll('#tmrList .tmr-row').forEach(r => r.classList.toggle('sel', r.dataset.id === sel));
}
// 点一行选中，再点一次取消
export function selectTomorrow(id) { setSel(sel === id ? null : id); }

export function removeTomorrow(id) {
  if (sel === id) sel = null;
  removeTomorrowTask(id);
  renderBedtime();
}

export function renameTomorrow(e, id) {
  e.stopPropagation();
  setSel(id);
  const task = tomorrowChain().find(x => x.id === id);
  if (!task) return;
  startInlineEdit(e.currentTarget, tt(task, 'title'), val => { updateTomorrowTask(id, 'title', val); renderBedtime(); });
}

export function editTomorrowStep(e, id) {
  e.stopPropagation();
  setSel(id);
  const task = tomorrowChain().find(x => x.id === id);
  if (!task) return;
  const holder = e.currentTarget.closest('.tmr-body');
  holder.innerHTML = '<div class="ft-text"></div>';
  startInlineEdit(holder.firstChild, task.starter || '', val => setTomorrowStarter(id, val), {
    allowEmpty:true, placeholder:exampleFor(task),
  });
  holder.querySelector('input')?.addEventListener('blur', () => setTimeout(renderBedtime, 0));
}

// ＋ 加一件：按类别分组的事件，点一下插在选中那行后面（没选就放最后）；也可以新建
export function openTomorrowAdd() {
  const all = [
    ...PAL_TEMPLATES.map(tp => ({ tpl:'t:' + tp.templateId, tp, title:loc(tp.templateId, 'title', tp.title) })),
    ...customTemplates.map(tp => ({ tpl:'c:' + tp.id, tp, title:tp.title })),
  ];
  const after = sel && tomorrowChain().find(x => x.id === sel);
  const modal = document.getElementById('tmrModal');
  modal.querySelector('.modal-box').innerHTML = `
    <div class="modal-title">${after ? t('bed.addAfter', { t:esc(tt(after, 'title')) }) : t('bed.addEnd')}</div>
    <div class="tmr-groups">${Object.keys(CATEGORIES).map(cat => {
      const tiles = all.filter(x => (x.tp.cat || 'other') === cat);
      if (!tiles.length) return '';
      return `<div class="pal-sec"><i style="background:${catColor(cat)}"></i>${t('cat.' + cat)}</div>
        <div class="pal-grid">${tiles.map(({ tpl, tp, title }) =>
          `<button class="pal-tile" style="--c:${catColor(tp.cat || 'other')}" onclick="addTomorrowTpl('${tpl}')">
            <span class="pt-icon">${glyph(tp, 24)}</span><span class="pt-name">${esc(title)}</span>
          </button>`).join('')}</div>`;
    }).join('')}</div>
    <button class="pal-add-btn" onclick="newEventForTomorrow()">${t('pal.new')}</button>`;
  modal.classList.remove('hidden');
}

// 新建事件：建完回到这个面板
export function newEventForTomorrow() {
  document.getElementById('tmrModal').classList.add('hidden');
  openCustomModal(() => openTomorrowAdd());
}

export function addTomorrowTpl(tpl) {
  const task = taskFromTpl(tpl);
  if (!task) return;
  addTomorrowTask(task, sel);
  sel = task.id; // 连续加会按顺序往下排
  document.getElementById('tmrModal').classList.add('hidden');
  renderBedtime();
  setTimeout(() => {
    const row = document.querySelector(`#tmrList .tmr-row[data-id="${task.id}"]`);
    row?.classList.add('just-added');
    row?.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 60);
}

export function toggleNight(id, el) {
  const chk = toggleCheck(id);
  el.className=`night-row${chk?' checked':''}`;
  el.querySelector('.cbox').innerHTML=chk?I.check:'';
}

// 点击清单文字可以直接改名
export function initBedtime() {
  document.getElementById('bedBody').addEventListener('click', e => {
    const clabelEl = e.target.closest('#nightChecklist .clabel');
    if (!clabelEl || clabelEl.dataset.editing) return;
    e.stopPropagation();
    const item = nightItems.find(it => it.id === clabelEl.closest('[data-item-id]').dataset.itemId);
    if (!item) return;
    startInlineEdit(clabelEl, loc(item.id, 'label', item.label), val => {
      updateNightItemLabel(item.id, val); renderBedtime();
    });
  });
  const modal = document.getElementById('tmrModal');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
}
