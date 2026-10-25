// 主页面：进度条 + 任务链卡片 + 拖拽排序
// → Swift: Views/ChainView.swift, Views/TaskCardView.swift

import {
  S, currentIdx, lastDoneIdx, isChecklistReady,
  completeCurrent, undoLast as undoLastAction, toggleCheck as toggleCheckAction,
  deleteTask, reorder,
} from '../store/store.js';
import { getFeedUrl } from '../store/storage.js';
import { I } from './icons.js';
import { editMode, editTarget } from './edit.js';
import { jobsHTML, loadJobs } from './jobs.js';
import { render } from './render.js';

let chainSortable = null;

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
function mkBtn(label, disabled=false) {
  return `<button class="complete-btn" onclick="completeTask()" ${disabled?'disabled':''}><span>${label}</span>${I.arrow}</button>`;
}

export function renderRail() {
  const ci = currentIdx();
  const rail = document.getElementById('progressRail');
  // 只在任务数量变化时重建 DOM，否则只更新 class
  // 这样新完成的 segment 才能触发 scaleX 过渡动画
  const existing = rail.querySelectorAll('.pseg');
  if (existing.length !== S.chain.length) {
    rail.innerHTML = S.chain.map(() => '<div class="pseg"></div>').join('');
  }
  const segs = rail.querySelectorAll('.pseg');
  S.chain.forEach((t, i) => {
    segs[i].className = 'pseg' + (S.completed[t.id] ? ' done' : i === ci ? ' active' : '');
  });
}

export function renderChain() {
  const ci = currentIdx();
  const canUndo = lastDoneIdx() >= 0;
  const allDone = ci >= S.chain.length;

  let html = S.chain.map((task, i) => {
    const done    = !!S.completed[task.id];
    const current = i === ci;
    const locked  = !done && !current;

    const isEditTarget = editMode && task.id === editTarget;
    let cls = 'task-row' + (done?' done':current?' current':' locked') + (isEditTarget?' edit-target':'');

    // right badge
    let badge = '';
    if (!editMode) {
      if (done)    badge = `<span class="row-check">${I.check}</span>`;
      if (locked)  badge = `<span class="row-lock">${I.lock}</span>`;
      if (current) badge = `<span class="row-now">NOW</span>`;
    }

    // body
    let body = '';
    if (current && !editMode) {
      if (task.hint) body += `<div class="row-hint">${task.hint}</div>`;

      if (task.type==='simple' || task.type==='palette') {
        body += mkBtn(task.btnLabel||'完成');
      } else if (task.type==='checklist') {
        body += `<div class="row-checks">` + (task.items||[]).map(it => {
          const chk = !!S.checks[it.id];
          return `<div class="check-row${chk?' checked':''}" data-item-id="${it.id}" onclick="toggleCheck('${it.id}')">
            <div class="cbox">${chk?I.check:''}</div>
            <div class="clabel">${it.label}</div>
          </div>`;
        }).join('') + `</div>`;
        body += mkBtn(task.btnLabel||'完成', !isChecklistReady(task));
      } else if (task.type==='first-thing') {
        const note = S[task.ftKey]||'';
        body += `<div class="ft-note">
          <div class="ft-label">第一件事</div>
          ${note?`<div class="ft-text">${esc(note)}</div>`:`<div class="ft-empty">在睡前清单里写下，明天自动显示</div>`}
        </div>`;
        body += mkBtn(task.btnLabel||'完成');
      } else if (task.type==='jobs') {
        body += jobsHTML();
        body += mkBtn(task.btnLabel||'完成');
      }
      if (canUndo) body += `<button class="undo-btn" onclick="undoLast()">${I.undo} 退回上一步</button>`;
    } else if (isEditTarget) {
      // 编辑模式展开体：显示可编辑的描述和打勾事项
      const hintTxt = task.hint || '';
      body += `<div class="row-hint" onclick="editField(event,'${task.id}','hint')">${hintTxt || '<em class="edit-ph">点击添加描述…</em>'}</div>`;
      if (task.type==='checklist') {
        body += '<div class="row-checks">' + (task.items||[]).map(it =>
          `<div class="check-row" data-item-id="${it.id}">
            <div class="cbox"></div>
            <div class="clabel" onclick="editCheckItem(event,'${task.id}','${it.id}')">${it.label}</div>
          </div>`
        ).join('') + '</div>';
      }
    }

    const titleClick = editMode ? `onclick="editField(event,'${task.id}','title')"` : '';
    const cardClick  = editMode && !isEditTarget ? `onclick="setEditTarget('${task.id}')"` : '';
    return `<div class="${cls}" data-id="${task.id}" data-type="${task.type}" ${cardClick}>
      <div class="row-top">
        <span class="row-icon">${task.icon}</span>
        <span class="row-title" ${titleClick}>${task.title}</span>
        <span class="row-right">
          ${badge}
          <button class="row-del" onclick="delTask('${task.id}')" title="删除">×</button>
        </span>
      </div>
      ${body?`<div class="row-body">${body}</div>`:''}
    </div>`;
  }).join('');

  if (allDone) {
    html += `<div class="all-done"><span class="big">🌟</span><h2>今天完成了！</h2></div>`;
  }

  document.getElementById('chainList').innerHTML = html;

  const jobsIdx = S.chain.findIndex(t=>t.id==='jobs');
  if (jobsIdx >= 0 && currentIdx() === jobsIdx && getFeedUrl()) {
    setTimeout(loadJobs, 0);
  }
}

// ── 拖拽排序（手机上长按） ──
export function initSortable() {
  if (chainSortable) { try { chainSortable.destroy(); } catch(e){} chainSortable = null; }
  if (editMode) return; // 编辑模式下禁用拖拽，避免 touch 事件冲突
  if (typeof Sortable === 'undefined') return; // CDN 未加载时（PWA 离线）跳过
  const el = document.getElementById('chainList');

  try { chainSortable = new Sortable(el, {
    animation:            220,
    ghostClass:           'sortable-ghost',
    chosenClass:          'sortable-chosen',
    dragClass:            'sortable-drag',
    delay:                400,
    delayOnTouchOnly:     true,
    touchStartThreshold:  6,
    filter:               '.complete-btn,.row-del,.undo-btn,.cbox,.check-row,.feed-link,.all-done',
    preventOnFilter:      false,

    onChoose(evt) {
      evt.item.classList.add('pressing');
      setTimeout(() => evt.item.classList.remove('pressing'), 420);
      if (navigator.vibrate) navigator.vibrate(40);
    },
    onEnd(evt) {
      if (evt.oldIndex === evt.newIndex) return;
      const ids = Array.from(el.querySelectorAll('[data-id]')).map(e=>e.dataset.id);
      reorder(ids);
      setTimeout(render, 0);
    }
  }); } catch(e) { console.warn('Sortable init failed', e); }
}

// ── 按钮处理 ──
export function completeTask() {
  if (!completeCurrent()) return;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

export function undoLast() {
  if (!undoLastAction()) return;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

export function toggleCheck(id) { toggleCheckAction(id); render(); }

export function delTask(id) { deleteTask(id); render(); }
