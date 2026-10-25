// 应用状态和所有数据操作。这里不碰 DOM，界面层改完数据后自己调 render()。
// → Swift: Store/ChainStore.swift

import { DEFAULT_TASKS, NIGHT_ITEMS } from '../models/defaults.js';
import * as storage from './storage.js';

const clone = o => JSON.parse(JSON.stringify(o));

export function todayKey() {
  const d = new Date();
  // 用本地日期，避免 UTC 偏差导致跨午夜 bug（UTC+8 早上 8 点前 UTC 还是前一天）
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function fresh() {
  const saved = storage.loadDefaultChain();
  return { date:todayKey(), chain:clone(saved || DEFAULT_TASKS), completed:{}, checks:{}, studyFirst:'', workFirst:'', uid:0 };
}

function loadDay() {
  try {
    const d = storage.loadDay();
    if (!d) return fresh();
    if (!d.chain) d.chain = clone(DEFAULT_TASKS);
    return d;
  } catch { return fresh(); }
}

// ── 状态（其他模块拿到的是实时绑定，只能在这里重新赋值） ──
export let S = loadDay();
export let customTemplates = storage.loadCustomTemplates();
export let nightItems = storage.loadNightItems() || clone(NIGHT_ITEMS);

// ── 保存 ──
export function persist()       { storage.saveDay(S); }
export function persistCustom() { storage.saveCustomTemplates(customTemplates); }
export function saveDefaults()  { storage.saveDefaultChain(S.chain); }
function persistNight()         { storage.saveNightItems(nightItems); }

// ── 查询 ──
export function currentIdx() {
  for (let i=0;i<S.chain.length;i++) if (!S.completed[S.chain[i].id]) return i;
  return S.chain.length;
}
export function lastDoneIdx() {
  let l=-1; S.chain.forEach((t,i)=>{ if(S.completed[t.id]) l=i; }); return l;
}
export function isChecklistReady(task) {
  return (task.items||[]).every(it=>S.checks[it.id]);
}
export function genId() { S.uid=(S.uid||0)+1; return S.uid; }

// ── 任务链操作 ──
// 返回 true 表示有变化
export function completeCurrent() {
  const ci = currentIdx();
  if (ci >= S.chain.length) return false;
  const t = S.chain[ci];
  if (t.type==='checklist' && !isChecklistReady(t)) return false;
  S.completed[t.id] = true;
  persist();
  return true;
}

export function undoLast() {
  const li = lastDoneIdx();
  if (li < 0) return false;
  delete S.completed[S.chain[li].id];
  persist();
  return true;
}

// 打勾（出门清单和睡前清单共用）；返回新状态
export function toggleCheck(id) {
  S.checks[id] = !S.checks[id];
  persist();
  return S.checks[id];
}

export function deleteTask(id) {
  S.chain = S.chain.filter(t=>t.id!==id);
  delete S.completed[id];
  saveDefaults(); persist();
}

export function reorder(newIds) {
  const map={}; S.chain.forEach(t=>map[t.id]=t);
  S.chain = newIds.map(id=>map[id]).filter(Boolean);
  saveDefaults(); persist();
}

// 插在当前任务后面；返回插入位置
export function insertAfterCurrent(task) {
  const ci = currentIdx();
  const at = ci < S.chain.length ? ci+1 : S.chain.length;
  S.chain.splice(at, 0, task);
  persist();
  return at;
}

// 重置今日进度，保留睡前写的"第一件事"
export function resetDay() {
  const k = {studyFirst:S.studyFirst, workFirst:S.workFirst};
  S = {...fresh(), ...k};
  persist();
}

// ── 编辑 ──
export function updateTaskField(taskId, field, val) {
  const task = S.chain.find(t => t.id === taskId);
  if (!task) return;
  task[field] = val;
  saveDefaults(); persist();
}

export function updateCheckItemLabel(taskId, itemId, val) {
  const task = S.chain.find(t => t.id === taskId);
  const item = task && (task.items||[]).find(it => it.id === itemId);
  if (!item) return;
  item.label = val;
  saveDefaults(); persist();
}

export function commitEdits() { saveDefaults(); persist(); }

// ── 自定义调板事件 ──
export function addCustomTemplate({ icon, title, btnLabel }) {
  customTemplates.push({ id:'ct_'+Date.now(), icon, title, btnLabel });
  persistCustom();
}

export function deleteCustomTemplate(id) {
  customTemplates = customTemplates.filter(t=>t.id!==id);
  persistCustom();
}

// ── 睡前 ──
export function setFirstThings(studyFirst, workFirst) {
  S.studyFirst = studyFirst;
  S.workFirst  = workFirst;
  persist();
}

export function updateNightItemLabel(id, val) {
  const item = nightItems.find(it => it.id === id);
  if (!item) return;
  item.label = val;
  persistNight();
}
