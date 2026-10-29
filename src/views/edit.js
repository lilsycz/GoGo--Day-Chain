// 编辑模式：点卡片展开，点文字直接改
// → Swift: Views/EditTaskSheet.swift

import { S, currentIdx, commitEdits, updateTaskField, updateCheckItemLabel } from '../store/store.js';
import { render } from './render.js';
import { esc } from './format.js';
import { t, tt, loc } from '../i18n/index.js';
import { onEditMode } from './palette.js';
import { seen, markSeen } from '../store/storage.js';
import { exampleFor } from '../i18n/index.js';
import * as haptic from '../services/haptics.js';

// 可以清空的字段，清空后显示的占位文字
const PLACEHOLDERS = {
  hint:    () => `<em class="edit-ph">${t('hint.edit.ph')}</em>`,
  starter: () => `<em class="edit-ph">${t('step.edit.ph')}</em>`,
};

export let editMode = false;
export let editTarget = null;

export function toggleEditMode() {
  editMode = !editMode;
  haptic.tap();
  document.body.classList.toggle('edit-mode', editMode);
  onEditMode(editMode); // 插入托盘跟着编辑模式出现 / 收起
  window.scrollTo({ top:0 });
  // 第一次进编辑：≡ 晃几下，提示可以拖
  if (editMode && !seen('drag')) {
    markSeen('drag');
    setTimeout(() => document.body.classList.add('hint-drag'), 400);
    setTimeout(() => document.body.classList.remove('hint-drag'), 2600);
  }
  if (editMode) {
    // 默认展开当前任务卡片
    editTarget = S.chain[currentIdx()]?.id || S.chain[0]?.id || null;
  } else {
    editTarget = null;
    commitEdits();
  }
  render();
}

export function setEditTarget(id) {
  if (!editMode) return;
  editTarget = id;
  render();
}

// 直接 onclick 调用（绑在元素上，不走委托，移动端更可靠）
// 编辑完只更新元素文字 + 持久化，不调 render()（避免 DOM 重建触发二次 blur）
export function editField(e, taskId, field) {
  if (!editMode) return;
  e.stopPropagation();
  const task = S.chain.find(t => t.id === taskId);
  if (!task) return;
  const el = e.currentTarget;
  if (el.dataset.editing) return;
  const placeholder = PLACEHOLDERS[field]?.();
  startInlineEdit(el, tt(task, field) || '', val => {
    updateTaskField(taskId, field, val);
    el.innerHTML = val ? esc(val) : placeholder;
    if (!val) setTimeout(render, 0); // 清空了就变回 ＋ 按钮
  }, { allowEmpty: !!placeholder, onInput: val => updateTaskField(taskId, field, val), raw: task[field] || '' });
}

export function editCheckItem(e, taskId, itemId) {
  if (!editMode) return;
  e.stopPropagation();
  const task = S.chain.find(t => t.id === taskId);
  const item = task && (task.items||[]).find(it => it.id === itemId);
  if (!item) return;
  const el = e.currentTarget;
  if (el.dataset.editing) return;
  startInlineEdit(el, loc(item.id, 'label', item.label), (val, inputEl) => {
    updateCheckItemLabel(taskId, itemId, val);
    inputEl.parentElement && (inputEl.parentElement.textContent = val);
  });
}

// 编辑卡片里的小 ＋：原地变成输入框，写了就保存，空着就收回
export function addField(e, taskId, field) {
  e.stopPropagation();
  const task = S.chain.find(t => t.id === taskId);
  if (!task) return;
  const holder = document.createElement('div');
  holder.className = field === 'hint' ? 'row-hint' : 'rs-text';
  e.currentTarget.closest('.add-chips').before(holder);
  e.currentTarget.remove();
  startInlineEdit(holder, '', val => updateTaskField(taskId, field, val), {
    allowEmpty: true, onInput: val => updateTaskField(taskId, field, val),
    placeholder: field === 'starter' ? exampleFor(task) : t('hint.edit.ph'),
  });
  holder.querySelector('input')?.addEventListener('blur', () => setTimeout(render, 0));
}

// 把元素换成输入框；回车保存，Esc 取消。allowEmpty: 允许清空
// onInput: 每打一个字就存（不重画），切出 app 也不会丢；改回原样时存 raw（内置名字存的是原文，好跟着语言切换）
export function startInlineEdit(el, value, onSave, { allowEmpty = false, placeholder = '', onInput = null, raw = value } = {}) {
  if (el.dataset.editing) return;
  el.dataset.editing = '1';
  const prevHTML = el.innerHTML;
  el.textContent = '';
  const input = document.createElement('input');
  input.className = 'inline-edit';
  input.value = value;
  input.placeholder = placeholder;
  el.appendChild(input);
  input.focus(); input.select();
  if (onInput) input.addEventListener('input', () => {
    const v = input.value.trim();
    if (v || allowEmpty) onInput(v === value ? raw : v);
  });

  let done = false, cancelled = false;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { cancelled = true; input.blur(); }
  });
  input.addEventListener('blur', () => {
    if (done) return; done = true;
    delete el.dataset.editing;
    const val = input.value.trim();
    if (cancelled && onInput) onInput(raw); // Esc：撤回已经存下的字
    if (!cancelled && (val || allowEmpty) && val !== value) onSave(val, input);
    else el.innerHTML = prevHTML;
  });
}

// click 委托只负责：在编辑模式下点击非编辑区域时切换 editTarget
// 字段编辑由元素上的 onclick 直接触发（移动端更可靠）
export function initEdit() {
  document.getElementById('chainList').addEventListener('click', e => {
    if (!editMode) return;
    if (e.target.closest('.row-title,.row-hint,.ft-text,.rs-text,.clabel,.row-del,.drag-handle,.circle-btn,.act,.text-link,.chain-fold,.add-chip,.style-btn')) return;
    const row = e.target.closest('[data-id]');
    if (!row || row.dataset.id === editTarget) return;
    setEditTarget(row.dataset.id);
  });
}
