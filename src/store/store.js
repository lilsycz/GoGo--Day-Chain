// 应用状态和所有数据操作。这里不碰 DOM，界面层改完数据后自己调 render()。
// → Swift: Store/ChainStore.swift
//
// 两份任务链：
//   S.chain       今天的（可以临时插入、换顺序、跳过，只影响今天）
//   每日任务模板   存在 storage 里，新的一天从它复制。编辑文字、拖拽排序、移除会同时改模板。
//   从调板插入的任务带 once:true，只属于今天，不进模板。

import { DEFAULT_TASKS, NIGHT_ITEMS } from '../models/defaults.js';
import { categoryOf } from '../models/categories.js';
import * as storage from './storage.js';

const clone = o => JSON.parse(JSON.stringify(o));

// 一天从凌晨 4 点开始算，熬夜过了 12 点还是"今天"
const DAY_START_HOUR = 4;

export function todayKey(now = new Date()) {
  const d = new Date(now.getTime() - DAY_START_HOUR * 3600_000);
  // 用本地日期，避免 UTC 偏差
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// 当天状态
//   startedAt  点"开始今天"的时间（null = 还没开始）
//   completed  { [taskId]: true }  做完的
//   skipped    { [taskId]: true }  今天跳过的
//   times      { [taskId]: { start, end?, icon, title, cat } }，任务真正开始时记 start，完成时记 end
//   rest       正在休息：{ start, remindAt?, fired?, again? }
//                remindAt: 不存在 = 还没选；null = 不提醒；数字 = 提醒时间
//   rests      [{ start, end }]，休息过的时间段
function fresh() {
  return {
    date:todayKey(), chain:clone(loadDaily()),
    completed:{}, skipped:{}, checks:{}, studyFirst:'', workFirst:'', uid:0,
    startedAt:null, times:{}, rests:[], rest:null,
  };
}

function loadDay() {
  try {
    const d = storage.loadDay();
    if (!d) return fresh();
    if (!d.chain) d.chain = clone(DEFAULT_TASKS);
    d.skipped ??= {};
    d.startedAt ??= null;
    d.times ??= {};
    d.rests ??= [];
    d.rest ??= null;
    return d;
  } catch { return fresh(); }
}

// ── 每日任务模板 ──
function loadDaily() { return storage.loadDefaultChain() || clone(DEFAULT_TASKS); }
function editDaily(fn) { const d = loadDaily(); fn(d); storage.saveDefaultChain(d); }

// ── 状态（其他模块拿到的是实时绑定，只能在这里重新赋值） ──
export let S = loadDay();
export let customTemplates = storage.loadCustomTemplates();
export let nightItems = storage.loadNightItems() || clone(NIGHT_ITEMS);

// ── 保存 ──
export function persist()       { storage.saveDay(S); }
export function persistCustom() { storage.saveCustomTemplates(customTemplates); }
function persistNight()         { storage.saveNightItems(nightItems); }

// ── 查询 ──
export const isResolved = id => !!(S.completed[id] || S.skipped[id]);

// 当前任务 = 第一件既没做完也没跳过的
export function currentIdx() {
  for (let i=0;i<S.chain.length;i++) if (!isResolved(S.chain[i].id)) return i;
  return S.chain.length;
}
// 当前之后的下一件
export function nextIdx() {
  for (let i=currentIdx()+1;i<S.chain.length;i++) if (!isResolved(S.chain[i].id)) return i;
  return -1;
}
export function lastDoneIdx() {
  let l=-1; S.chain.forEach((t,i)=>{ if(S.completed[t.id]) l=i; }); return l;
}
export function isChecklistReady(task) {
  return (task.items||[]).every(it=>S.checks[it.id]);
}
export function genId() { S.uid=(S.uid||0)+1; return S.uid; }

// 卡片上显示的"第一步"：学习/工作优先用睡前写的，其次用卡片上长期保存的
export function starterOf(task) {
  return (task.type==='first-thing' && S[task.ftKey]) || task.starter || '';
}

// ── 时间记录 ──
const snapshot = t => ({ icon:t.icon, glyph:t.glyph, title:t.title, cat:categoryOf(t) });

// 让 times 和"当前任务"保持一致：
// 不在休息时，当前任务还没开始时间就记上；
// 不再是当前、又没完成的任务（被退回、移除、换掉）去掉开始时间
function syncStarts(now = Date.now()) {
  if (!S.startedAt) return;
  const cur = S.chain[currentIdx()];
  for (const [id, tm] of Object.entries(S.times)) {
    if (!tm.end && (!cur || id !== cur.id)) delete S.times[id];
  }
  if (cur && !S.rest && !S.times[cur.id]) S.times[cur.id] = { start:now, ...snapshot(cur) };
}

// 任务链变了之后调用：没有下一件了就结束休息
function afterChainChange(now = Date.now()) {
  if (S.rest && currentIdx() >= S.chain.length) endRest(now);
  else syncStarts(now);
}

export function startDay() {
  if (S.startedAt) return;
  S.startedAt = Date.now();
  syncStarts(S.startedAt);
  persist();
}

// 把一天的状态整理成一条记录（没点过"开始今天"就没有记录）
export function buildRecord(s = S) {
  if (!s.startedAt) return null;
  const blocks = Object.entries(s.times || {})
    .map(([id, tm]) => ({ id, icon:tm.icon, glyph:tm.glyph, title:tm.title, cat:tm.cat, start:tm.start, end:tm.end || null }))
    .sort((a, b) => a.start - b.start);
  const rests = (s.rests || []).map(r => ({...r}));
  if (s.rest) rests.push({ start:s.rest.start, end:null });
  return { date:s.date, startedAt:s.startedAt, blocks, rests };
}

export function getHistory() { return storage.loadHistory(); }

// 新的一天：把昨天存进记录，换一张新的任务链。睡前写的"第一件事"留到新的一天用。
// 返回 true 表示换天了
export function rollOverIfNewDay() {
  if (S.date === todayKey()) return false;
  const rec = buildRecord(S);
  if (rec) storage.saveHistory([rec, ...storage.loadHistory().filter(r => r.date !== rec.date)]);
  S = { ...fresh(), studyFirst:S.studyFirst, workFirst:S.workFirst };
  persist();
  return true;
}

// ── 完成 / 退回 ──
// 完成当前任务；后面还有事就进入休息。返回 true 表示有变化
export function completeCurrent() {
  const ci = currentIdx();
  if (ci >= S.chain.length) return false;
  const t = S.chain[ci];
  if (t.type==='checklist' && !isChecklistReady(t)) return false;
  const now = Date.now();
  S.completed[t.id] = true;
  if (S.times[t.id]) Object.assign(S.times[t.id], { end:now, ...snapshot(t) });
  if (S.startedAt && currentIdx() < S.chain.length) S.rest = { start:now };
  syncStarts(now);
  persist();
  return true;
}

export function undoLast() {
  const li = lastDoneIdx();
  if (li < 0) return false;
  const id = S.chain[li].id;
  S.rest = null; // 退回 = 上一件其实没做完，这段休息不算
  delete S.completed[id];
  if (S.times[id]) delete S.times[id].end;
  syncStarts();
  persist();
  return true;
}

// ── 休息 ──
// minutes: 数字 = 多少分钟后提醒；null = 不提醒
export function setReminder(minutes) {
  if (!S.rest) return;
  S.rest.remindAt = minutes == null ? null : Date.now() + minutes * 60000;
  S.rest.fired = false;
  persist();
}

// 重新选提醒时间（"等下做" / "改提醒"）
export function reopenReminderPicker() {
  if (!S.rest) return;
  delete S.rest.remindAt;
  S.rest.fired = false;
  S.rest.again = true;
  persist();
}

// 结束休息，开始下一件。不到一分钟的休息不记
export function endRest(now = Date.now()) {
  if (!S.rest) return;
  if (now - S.rest.start >= 60000) S.rests.push({ start:S.rest.start, end:now });
  S.rest = null;
  syncStarts(now);
  persist();
}

export function reminderDue() {
  return !!(S.rest && S.rest.remindAt && Date.now() >= S.rest.remindAt);
}

export function markReminderFired() {
  if (!S.rest) return;
  S.rest.fired = true;
  persist();
}

// ── 只影响今天的操作 ──
// 打勾（出门清单和睡前清单共用）；返回新状态
export function toggleCheck(id) {
  S.checks[id] = !S.checks[id];
  persist();
  return S.checks[id];
}

// 把某件事提到现在做
export function bringToFront(id) {
  const from = S.chain.findIndex(t => t.id === id);
  const ci = currentIdx();
  if (from <= ci) return;
  const [t] = S.chain.splice(from, 1);
  S.chain.splice(ci, 0, t);
  afterChainChange(); persist();
}

// 放到今天最后
export function moveToEnd(id) {
  const from = S.chain.findIndex(t => t.id === id);
  if (from < 0) return;
  const [t] = S.chain.splice(from, 1);
  S.chain.push(t);
  afterChainChange(); persist();
}

export function skipTask(id) {
  S.skipped[id] = true;
  afterChainChange(); persist();
}

// 恢复跳过的任务：放到当前这件后面，不打断正在做的
export function unskipTask(id) {
  const from = S.chain.findIndex(t => t.id === id);
  if (from < 0) return;
  delete S.skipped[id];
  const [t] = S.chain.splice(from, 1);
  const ci = currentIdx();
  S.chain.splice(ci < S.chain.length ? ci + 1 : S.chain.length, 0, t);
  afterChainChange(); persist();
}

// 插在当前任务后面（只属于今天）；返回插入位置
export function insertAfterCurrent(task) {
  const ci = currentIdx();
  const at = ci < S.chain.length ? ci+1 : S.chain.length;
  S.chain.splice(at, 0, task);
  afterChainChange(); // 全部做完后再插入，新任务直接变成当前
  persist();
  return at;
}

// 重置今日进度（今天的记录也清掉），保留睡前写的"第一件事"
export function resetDay() {
  const k = {studyFirst:S.studyFirst, workFirst:S.workFirst};
  S = {...fresh(), ...k};
  persist();
}

// ── 同时改今天和每日模板的操作 ──
export function updateTaskField(taskId, field, val) {
  const task = S.chain.find(t => t.id === taskId);
  if (!task) return;
  task[field] = val;
  editDaily(d => { const t = d.find(x => x.id === taskId); if (t) t[field] = val; });
  persist();
}

export function updateCheckItemLabel(taskId, itemId, val) {
  const task = S.chain.find(t => t.id === taskId);
  const item = task && (task.items||[]).find(it => it.id === itemId);
  if (!item) return;
  item.label = val;
  editDaily(d => {
    const it = (d.find(x => x.id === taskId)?.items || []).find(x => x.id === itemId);
    if (it) it.label = val;
  });
  persist();
}

// 拖拽排序：今天和模板都按新顺序排
export function reorder(newIds) {
  const map={}; S.chain.forEach(t=>map[t.id]=t);
  S.chain = newIds.map(id=>map[id]).filter(Boolean);
  const rank = id => { const i = newIds.indexOf(id); return i < 0 ? Infinity : i; };
  editDaily(d => d.sort((a, b) => rank(a.id) - rank(b.id)));
  afterChainChange(); persist();
}

// 移除任务（今天 + 模板）；返回可以用来撤销的信息
export function removeTask(id) {
  const idx = S.chain.findIndex(t => t.id === id);
  if (idx < 0) return null;
  const undo = {
    idx, task:S.chain[idx],
    completed:S.completed[id], skipped:S.skipped[id], time:S.times[id],
    daily:loadDaily(),
  };
  S.chain.splice(idx, 1);
  delete S.completed[id];
  delete S.skipped[id];
  if (S.times[id] && !S.times[id].end) delete S.times[id];
  editDaily(d => { const i = d.findIndex(t => t.id === id); if (i >= 0) d.splice(i, 1); });
  afterChainChange(); persist();
  return undo;
}

export function restoreTask(undo) {
  const id = undo.task.id;
  if (S.chain.some(t => t.id === id)) return;
  S.chain.splice(Math.min(undo.idx, S.chain.length), 0, undo.task);
  if (undo.completed) S.completed[id] = true;
  if (undo.skipped) S.skipped[id] = true;
  if (undo.time) S.times[id] = undo.time;
  storage.saveDefaultChain(undo.daily);
  afterChainChange(); persist();
}

// 把今天临时插入的任务加进每日模板（放在它前面那件每日任务后面）
export function addToDaily(id) {
  const task = S.chain.find(t => t.id === id);
  if (!task) return;
  delete task.once;
  const before = S.chain.slice(0, S.chain.indexOf(task)).filter(t => !t.once).map(t => t.id);
  editDaily(d => {
    if (d.some(x => x.id === id)) return;
    let pos = 0;
    d.forEach((x, i) => { if (before.includes(x.id)) pos = i + 1; });
    d.splice(pos, 0, clone(task));
  });
  persist();
}

export function commitEdits() { persist(); }

// ── 自定义调板事件 ──
export function addCustomTemplate({ glyph, title, btnLabel, starter, cat }) {
  customTemplates.push({ id:'ct_'+Date.now(), glyph, title, btnLabel, starter, cat });
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

// 启动时先检查是不是新的一天
rollOverIfNewDay();
