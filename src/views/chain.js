// 主页面：进度条 + 开始卡片 + 任务链卡片 + 拖拽排序
// → Swift: Views/ChainView.swift, Views/TaskCardView.swift
//
// 默认是专注视图：只显示当前这件和下一件，其余折叠；点"显示全部"展开。
// 编辑模式下总是显示全部。

import {
  S, currentIdx, nextIdx, lastDoneIdx, isChecklistReady, starterOf,
  startDay as startDayAction, completeCurrent, undoLast as undoLastAction,
  toggleCheck as toggleCheckAction, unskipTask as unskipAction,
  removeTask as removeTaskAction, restoreTask, addToDaily as addToDailyAction,
  updateTaskField, reorder,
} from '../store/store.js';
import { getFeedUrl } from '../store/storage.js';
import { categoryOf, catVars } from '../models/categories.js';
import { I } from './icons.js';
import { esc, fmtTime } from './format.js';
import { glyph, glyphSVG, stripEmoji } from './glyphs.js';
import { t, tt, loc } from '../i18n/index.js';
import { editMode, editTarget, startInlineEdit } from './edit.js';
import { jobsHTML, loadJobs } from './jobs.js';
import { showToast } from './toast.js';
import { render } from './render.js';
import { dropTpl } from './palette.js';

let chainSortable = null;
let showAll = false;

const STEP_PH = () => `<em class="edit-ph">${t('step.edit.ph')}</em>`;
const HINT_PH = () => `<em class="edit-ph">${t('hint.edit.ph')}</em>`;

// 大圆形主按钮
function circleBtn(label, onclick, disabled=false) {
  const long = String(label).length > 5 ? ' long' : '';
  return `<button class="circle-btn${long}" onclick="${onclick}" ${disabled?'disabled':''}><span>${label}</span>${I.arrow}</button>`;
}
function stepBox(inner, label=t('step')) {
  return `<div class="ft-note"><div class="ft-label">${label}</div>${inner}</div>`;
}

export function renderRail() {
  const ci = S.startedAt ? currentIdx() : -1;
  const rail = document.getElementById('progressRail');
  // 只在任务数量变化时重建 DOM，否则只更新 class
  // 这样新完成的 segment 才能触发 scaleX 过渡动画
  const existing = rail.querySelectorAll('.pseg');
  if (existing.length !== S.chain.length) {
    rail.innerHTML = S.chain.map(() => '<div class="pseg"></div>').join('');
  }
  const segs = rail.querySelectorAll('.pseg');
  S.chain.forEach((t, i) => {
    segs[i].className = 'pseg' + (S.completed[t.id] ? ' done' : S.skipped[t.id] ? ' skipped' : i === ci ? ' active' : '');
  });
}

// 还没点"开始今天"时，顶部显示开始卡片
export function renderStartCard() {
  const box = document.getElementById('startDay');
  if (S.startedAt || editMode || !S.chain.length) { box.innerHTML = ''; return; }
  const first = S.chain[currentIdx()];
  const step = first ? starterOf(first) : '';
  box.innerHTML = `<div class="hero start-card">
    <div class="hero-kicker">${t('start.kicker')}</div>
    <div class="hero-title">${t('start.title')}</div>
    ${first ? stepBox(`<div class="ft-text with-glyph">${glyph(first, 22)} ${esc(tt(first, 'title'))}${step ? ` — ${esc(step)}` : ''}</div>`, t('start.first')) : ''}
    <div class="hero-foot">
      ${circleBtn(t('start.btn'), 'startDay()')}
      <div class="hero-actions"><button class="act" onclick="openPalette()">${I.plus}<span>${t('start.insert')}</span></button></div>
    </div>
  </div>`;
}

// 当前卡片里的"第一步"：没写过就显示一行可以直接点的提示
function currentStepHTML(task) {
  if (task.type==='first-thing' && S[task.ftKey]) {
    return stepBox(`<div class="ft-text">${esc(S[task.ftKey])}</div>`, t('step.bedtime'));
  }
  if (task.starter) {
    return stepBox(`<div class="ft-text editable" onclick="editStarter(event,'${task.id}')">${esc(task.starter)}</div>`);
  }
  return `<div class="ft-ghost" onclick="editStarter(event,'${task.id}')">${glyphSVG('pen', 16)} ${t('step.ghost')}</div>`;
}

function cardHTML(task, i, ci, canUndo) {
  const done    = !!S.completed[task.id];
  const skipped = !!S.skipped[task.id];
  const current = i === ci;
  const locked  = !done && !skipped && !current;

  const isEditTarget = editMode && task.id === editTarget;
  const hero = current && !editMode;
  const cls = 'task-row' + (done?' done':skipped?' skipped':current?' current':' locked') + (hero?' hero':'') + (isEditTarget?' edit-target':'');

  // 右侧标记
  let badge = '';
  if (!editMode) {
    const tm = S.times[task.id];
    if (done)    badge = (tm?.start && tm?.end ? `<span class="row-time">${fmtTime(tm.start)}–${fmtTime(tm.end)}</span>` : '') + `<span class="row-check">${I.check}</span>`;
    if (skipped) badge = `<span class="row-skip">${t('skipped')}</span><button class="row-restore" onclick="unskipTask('${task.id}')">${t('restore')}</button>`;
    if (locked)  badge = `<span class="row-lock">${I.lock}</span>`;
    if (current) badge = `<span class="row-now">NOW</span>`;
  }
  const del = editMode
    ? `<button class="row-del" onclick="removeTask('${task.id}')" title="${t('remove')}">×</button><span class="drag-handle" aria-label="${t('drag')}" onclick="event.stopPropagation()">${I.grip}</span>`
    : '';

  // 卡片内容
  let body = '', foot = '';
  if (hero) {
    if (task.hint) body += `<div class="row-hint">${esc(tt(task, 'hint'))}</div>`;
    body += currentStepHTML(task);

    if (task.type==='checklist') {
      body += `<div class="row-checks">` + (task.items||[]).map(it => {
        const chk = !!S.checks[it.id];
        return `<div class="check-row${chk?' checked':''}" data-item-id="${it.id}" onclick="toggleCheck('${it.id}')">
          <div class="cbox">${chk?I.check:''}</div>
          <div class="clabel">${esc(stripEmoji(loc(it.id, 'label', it.label)))}</div>
        </div>`;
      }).join('') + `</div>`;
    } else if (task.type==='jobs') {
      body += jobsHTML();
    }

    foot = `<div class="hero-foot">
      ${circleBtn(tt(task, 'btnLabel')||t('done.default'), 'completeTask()', task.type==='checklist' && !isChecklistReady(task))}
      <div class="hero-actions">
        <button class="act" onclick="openSwap()">${I.swap}<span>${t('act.swap')}</span></button>
        <button class="act" onclick="openPalette()">${I.plus}<span>${t('act.insert')}</span></button>
        ${canUndo ? `<button class="act" onclick="undoLast()">${I.undo}<span>${t('act.undo')}</span></button>` : ''}
      </div>
    </div>`;
  } else if (isEditTarget) {
    // 编辑模式展开体：描述、第一步、打勾事项都可以点了改
    body += `<div class="row-hint" onclick="editField(event,'${task.id}','hint')">${task.hint ? esc(tt(task, 'hint')) : HINT_PH()}</div>`;
    body += stepBox(`<div class="ft-text" onclick="editField(event,'${task.id}','starter')">${task.starter ? esc(task.starter) : STEP_PH()}</div>`);
    if (task.type==='checklist') {
      body += '<div class="row-checks">' + (task.items||[]).map(it =>
        `<div class="check-row" data-item-id="${it.id}">
          <div class="cbox"></div>
          <div class="clabel" onclick="editCheckItem(event,'${task.id}','${it.id}')">${esc(stripEmoji(loc(it.id, 'label', it.label)))}</div>
        </div>`
      ).join('') + '</div>';
    }
    if (task.once) {
      body += `<div class="once-note">${t('once')} · <button class="text-link inline" onclick="addToDaily('${task.id}')">${t('once.add')}</button></div>`;
    }
  }

  const titleClick = editMode ? `onclick="editField(event,'${task.id}','title')"` : '';
  const cardClick  = editMode && !isEditTarget ? `onclick="setEditTarget('${task.id}')"` : '';
  const cat = categoryOf(task);
  return `<div class="${cls}" data-id="${task.id}" data-type="${task.type}" data-cat="${cat}" style="${catVars(cat)}" ${cardClick}>
    <div class="row-top">
      ${hero ? '' : '<span class="dot"></span>'}
      <span class="row-icon">${glyph(task, hero ? 30 : 20)}</span>
      <span class="row-title" ${titleClick}>${esc(tt(task, 'title'))}</span>
      <span class="row-right">${badge}${del}</span>
    </div>
    ${body?`<div class="row-body">${body}</div>`:''}
    ${foot}
  </div>`;
}

export function renderChain() {
  const started = !!S.startedAt;
  const ci = started ? currentIdx() : -1;
  const focus = currentIdx();
  const canUndo = lastDoneIdx() >= 0;
  const allDone = focus >= S.chain.length;
  const expanded = showAll || editMode;

  // 专注视图只显示当前和下一件
  const ni = nextIdx();
  // 还没开始时，开始卡片已经写了先做什么，列表就先不显示
  const visible = expanded
    ? S.chain.map((_, i) => i)
    : started ? [focus, ni].filter(i => i >= 0 && i < S.chain.length) : [];

  const doneN = S.chain.filter(t => S.completed[t.id]).length;
  const skipN = S.chain.filter(t => S.skipped[t.id]).length;
  const hiddenN = S.chain.length - visible.length;

  let html = '';
  if (!expanded && doneN + skipN > 0) {
    html += `<div class="chain-fold" onclick="toggleShowAll()">${t('fold.done', {n:doneN})}${skipN ? t('fold.skip', {n:skipN}) : ''}</div>`;
  }
  html += visible.map(i => {
    const label = !expanded && i === ni ? `<div class="section-label">${t('next')}</div>` : '';
    return label + cardHTML(S.chain[i], i, ci, canUndo);
  }).join('');

  if (allDone && started) {
    html += `<div class="all-done">
      <div class="done-art"><span class="c1"></span><span class="c2"></span></div>
      <h2>${t('alldone')}</h2>
      <button class="text-link" onclick="openToday()">${t('alldone.log')}</button>
      <button class="text-link" onclick="openPalette()">${t('alldone.add')}</button>
    </div>`;
  }
  if (!editMode) {
    if (!expanded && hiddenN > 0) {
      html += `<div class="chain-fold" onclick="toggleShowAll()">${t('fold.all')}</div>`;
    } else if (expanded && S.chain.length > 2) {
      html += `<div class="chain-fold" onclick="toggleShowAll()">${t('fold.less')}</div>`;
    }
  }

  document.getElementById('chainList').innerHTML = html;

  const jobsIdx = S.chain.findIndex(t=>t.id==='jobs');
  if (jobsIdx >= 0 && ci === jobsIdx && getFeedUrl()) {
    setTimeout(loadJobs, 0);
  }
}

// 拖拽后的新顺序：只重排页面上看得见的那几件，折叠起来的任务原地不动
// visibleIds = 拖完后页面上卡片的顺序
export function orderAfterDrag(visibleIds) {
  const seen = new Set(visibleIds);
  const slots = [];
  S.chain.forEach((t, i) => { if (seen.has(t.id)) slots.push(i); });
  const ids = S.chain.map(t => t.id);
  slots.forEach((slot, k) => { ids[slot] = visibleIds[k]; });
  return ids;
}

// ── 拖拽（只在编辑模式）：按住 ≡ 排序；同时接收从插入托盘拖来的事件 ──
// 只有 ≡ 能拖起列表里的任务，所以上下滚动不会误触
export function initSortable() {
  if (chainSortable) { try { chainSortable.destroy(); } catch(e){} chainSortable = null; }
  if (!editMode || typeof Sortable === 'undefined') return; // CDN 未加载时（PWA 离线）跳过
  const el = document.getElementById('chainList');

  try { chainSortable = new Sortable(el, {
    group:         { name:'chain', pull:false, put:['palette'] },
    animation:     200,
    draggable:     '.task-row',
    handle:        '.drag-handle',
    forceFallback: true,   // 和托盘一致，手机上拖动的东西紧跟手指
    fallbackOnBody: true,
    ghostClass:    'sortable-ghost',
    chosenClass:   'sortable-chosen',

    onChoose(evt) {
      if (navigator.vibrate) navigator.vibrate(30);
    },
    // 列表内排序
    onEnd(evt) {
      if (evt.from !== evt.to || evt.oldIndex === evt.newIndex) return;
      const visible = Array.from(el.querySelectorAll('.task-row[data-id]')).map(e => e.dataset.id);
      reorder(orderAfterDrag(visible));
      setTimeout(render, 0);
    },
    // 从托盘拖进来：找到它后面的第一件任务，插在那件前面
    onAdd(evt) {
      const item = evt.item, tpl = item.dataset.tpl;
      let next = item.nextElementSibling;
      while (next && !next.classList.contains('task-row')) next = next.nextElementSibling;
      const beforeId = next?.dataset.id || null;
      item.remove();
      // 等拖拽库收完尾再改数据、重画，不然它的结束回调会丢
      if (tpl) setTimeout(() => dropTpl(tpl, beforeId), 0);
    },
  }); } catch(e) { console.warn('Sortable init failed', e); }
}

// ── 按钮处理 ──
export function toggleShowAll() { showAll = !showAll; render(); }

export function startDay() {
  startDayAction();
  render();
}

export function completeTask() {
  if (!completeCurrent()) return;
  if (navigator.vibrate) navigator.vibrate(30);
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

export function undoLast() {
  if (!undoLastAction()) return;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

export function toggleCheck(id) { toggleCheckAction(id); render(); }

export function unskipTask(id) { unskipAction(id); render(); }

// 编辑模式里的 ×：从今天和每日任务里移除，几秒内可以撤销
export function removeTask(id) {
  const undo = removeTaskAction(id);
  render();
  if (!undo) return;
  const title = esc(tt(undo.task, 'title'));
  const msg = t(undo.task.once ? 'toast.removed' : 'toast.removedDaily', { t:title });
  showToast(msg, t('undo'), () => { restoreTask(undo); render(); });
}

export function addToDaily(id) {
  addToDailyAction(id);
  render();
  showToast(t('toast.daily'));
}

// 不用进编辑模式，直接在当前卡片上写第一步
export function editStarter(e, taskId) {
  e.stopPropagation();
  const task = S.chain.find(t => t.id === taskId);
  if (!task) return;
  const el = e.currentTarget;
  startInlineEdit(el, task.starter || '', val => {
    updateTaskField(taskId, 'starter', val);
    setTimeout(render, 0);
  }, { allowEmpty: true, placeholder: t('step.ph') });
}
