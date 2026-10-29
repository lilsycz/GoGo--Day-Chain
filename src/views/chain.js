// 主页面：进度条 + 开始卡片 + 任务链卡片 + 拖拽排序
// → Swift: Views/ChainView.swift, Views/TaskCardView.swift
//
// 默认是专注视图：只显示当前这件和下一件，其余折叠；点"显示全部"展开。
// 编辑模式下总是显示全部。

import {
  S, currentIdx, nextIdx, lastDoneIdx, isChecklistReady, starterOf,
  startDay as startDayAction, completeCurrent, undoLast as undoLastAction,
  toggleCheck as toggleCheckAction, unskipTask as unskipAction,
  removeTask as removeTaskAction, restoreTask,
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
import { stepInputHTML } from './stepInput.js';
import * as haptic from '../services/haptics.js';

let chainSortable = null;
let showAll = false;

const STEP_PH = () => `<em class="edit-ph">${t('step.edit.ph')}</em>`;
const HINT_PH = () => `<em class="edit-ph">${t('hint.edit.ph')}</em>`;

// 大圆形主按钮
// 按钮文字里的 emoji 去掉（老数据里有"今天完成 🎉"）
const noEmoji = s => String(s).replace(/\s*[\p{Extended_Pictographic}\uFE0F\u200D]+/gu, '').trim();

function circleBtn(label, onclick, disabled=false) {
  label = noEmoji(label);
  const long = label.length > 5 ? ' long' : '';
  return `<button class="circle-btn${long}" onclick="${onclick}" ${disabled?'disabled':''}><span>${label}</span>${I.arrow}</button>`;
}

// 今天最后一件：按钮写"今天完成"，圆按钮轻轻放大缩小
function lastBtn(disabled=false) {
  return `<button class="circle-btn day-done" onclick="completeTask()" ${disabled?'disabled':''}><span>${t('day.done')}</span>${I.arrow}</button>`;
}
// 编辑列表里一行"第一步 xxx"，点文字就改
export function stepLine(text, onclick) {
  return `<div class="row-step"><span class="rs-label">${t('step')}</span><span class="rs-text" onclick="${onclick}">${esc(text)}</span></div>`;
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
    ${first ? stepBox(`<div class="ft-text with-glyph">${glyph(first, 22)} ${esc(tt(first, 'title'))}${step ? ` — ${esc(step)}` : ''}</div>${step ? '' : stepInputHTML(first)}`, t('start.first')) : ''}
    <div class="hero-foot">
      ${circleBtn(t('start.btn'), 'startDay()')}
      <div class="hero-actions"><button class="act" onclick="openPalette()">${I.plus}<span>${t('start.insert')}</span></button></div>
    </div>
  </div>`;
}

// 当前卡片里的"第一步"：只显示（在休息时或编辑模式里写）；没写就不显示
function currentStepHTML(task) {
  if (task.starter) return stepBox(`<div class="ft-text">${esc(task.starter)}</div>`);
  return '';
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
      ${nextIdx() < 0
        ? lastBtn(task.type==='checklist' && !isChecklistReady(task))
        : circleBtn(tt(task, 'btnLabel')||t('done.default'), 'completeTask()', task.type==='checklist' && !isChecklistReady(task))}
      <div class="hero-actions">
        <button class="act" onclick="openSwap()">${I.swap}<span>${t('act.swap')}</span></button>
        <button class="act" onclick="openPalette()">${I.plus}<span>${t('act.insert')}</span></button>
        ${canUndo ? `<button class="act" onclick="undoLast()">${I.undo}<span>${t('act.undo')}</span></button>` : ''}
      </div>
    </div>`;
  } else if (editMode) {
    // 编辑模式：没做完的每行都能写第一步——写了就显示、点一下改；没写只放一个小 ＋ 按钮
    // 展开的那行再多出清单（已有的描述也能改）
    const open = !done && !skipped;
    if (isEditTarget && task.hint) body += `<div class="row-hint" onclick="editField(event,'${task.id}','hint')">${esc(tt(task, 'hint'))}</div>`;
    if (open && task.starter) body += stepLine(task.starter, `editField(event,'${task.id}','starter')`);
    const adds = [open && !task.starter && 'starter'].filter(Boolean);
    if (adds.length) body += `<div class="add-chips">${adds.map(f =>
      `<button class="add-chip" onclick="addField(event,'${task.id}','${f}')">${I.plus}<span>${t(f === 'hint' ? 'field.hint' : 'field.step')}</span></button>`
    ).join('')}</div>`;
  }
  if (isEditTarget) {
    if (task.type==='checklist') {
      body += '<div class="row-checks">' + (task.items||[]).map(it =>
        `<div class="check-row" data-item-id="${it.id}">
          <div class="cbox"></div>
          <div class="clabel" onclick="editCheckItem(event,'${task.id}','${it.id}')">${esc(stripEmoji(loc(it.id, 'label', it.label)))}</div>
        </div>`
      ).join('') + '</div>';
    }
  }

  const titleClick = editMode ? `onclick="editField(event,'${task.id}','title')"` : '';
  const cardClick  = editMode && !isEditTarget ? `onclick="setEditTarget('${task.id}')"` : '';
  const cat = categoryOf(task);
  return `<div class="${cls}" data-id="${task.id}" data-type="${task.type}" data-cat="${cat}" style="${catVars(cat)}" ${cardClick}>
    <div class="row-top">
      ${editMode
        ? `<button class="style-btn" onclick="event.stopPropagation();openStylePicker('${task.id}')" aria-label="${t('aria.style')}"><span class="dot"></span><span class="row-icon">${glyph(task, 20)}</span></button>`
        : `${hero ? '' : '<span class="dot"></span>'}<span class="row-icon">${glyph(task, hero ? 30 : 20)}</span>`}
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
      <div class="done-art${justFinished ? ' pop' : ''}"><span class="c1"></span><span class="c2"></span></div>
      <h2>${t('alldone')}</h2>
      <button class="btn-primary alldone-edit" onclick="openBedtime(true)">${t('bed.editTomorrow')}</button>
      <button class="text-link icon-link" onclick="openToday()"><span>${t('alldone.log')}</span>${I.arrow}</button>
      <button class="text-link icon-link" onclick="openPalette()">${I.plus}<span>${t('alldone.add')}</span></button>
      ${canUndo ? `<button class="text-link undo-link" onclick="undoLast()">${I.undo}<span>${t('act.undo')}</span></button>` : ''}
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
  justFinished = false;

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
      haptic.tap();
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
      haptic.tap();
      // 等拖拽库收完尾再改数据、重画，不然它的结束回调会丢
      if (tpl) setTimeout(() => dropTpl(tpl, beforeId), 0);
    },
  }); } catch(e) { console.warn('Sortable init failed', e); }
}

// ── 按钮处理 ──
export function toggleShowAll() { showAll = !showAll; render(); }

export function startDay() {
  haptic.tap();
  startDayAction();
  render();
}

export function completeTask() {
  const isLast = S.startedAt && nextIdx() < 0;
  if (!completeCurrent()) return;
  isLast ? haptic.celebrate() : haptic.success();
  if (isLast) justFinished = true;
  render();
  if (isLast) {
    // 今天最后一件：完成画面的大圆弹出来，同时从它后面撒一圈彩色圆点
    window.scrollTo({ top:0 });
    requestAnimationFrame(() => {
      const r = document.querySelector('.done-art')?.getBoundingClientRect();
      if (r) celebrate(r.left + r.width / 2, r.top + r.height / 2);
    });
  } else {
    window.scrollTo({top:0,behavior:'smooth'});
  }
}

// 撒花：一圈朱红 / 钴蓝 / 琥珀 / 黑色的小圆点从按钮弹出去
let justFinished = false;
function celebrate(x, y) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.style.left = x + 'px';
  layer.style.top = y + 'px';
  const colors = ['#e8452c', '#2b3df0', '#f0a81c', '#151515'];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 120 + Math.random() * 90;
    const size = 8 + Math.round(Math.random() * 10);
    d.style.setProperty('--x', Math.cos(a) * dist + 'px');
    d.style.setProperty('--y', Math.sin(a) * dist + 'px');
    d.style.width = d.style.height = size + 'px';
    d.style.background = colors[i % colors.length];
    d.style.animationDelay = (i % 4) * 0.03 + 's';
    layer.appendChild(d);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1400);
}

export function undoLast() {
  if (!undoLastAction()) return;
  haptic.tap();
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

export function toggleCheck(id) { haptic.tap(); toggleCheckAction(id); render(); }

export function unskipTask(id) { unskipAction(id); render(); }

// 编辑模式里的 ×：从今天和每日任务里移除，几秒内可以撤销
export function removeTask(id) {
  const undo = removeTaskAction(id);
  haptic.tap();
  render();
  if (!undo) return;
  const title = esc(tt(undo.task, 'title'));
  const msg = t('toast.removed', { t:title });
  showToast(msg, t('undo'), () => { restoreTask(undo); render(); });
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
