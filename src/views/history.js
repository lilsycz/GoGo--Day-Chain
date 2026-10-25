// 记录页：每天几点到几点做了什么，颜色和卡片一致
// → Swift: Views/HistoryView.swift, Views/DayTimelineView.swift

import { S, buildRecord, getHistory, todayKey } from '../store/store.js';
import { CATEGORIES, catColor } from '../models/categories.js';
import { esc, fmtTime, fmtDur, fmtDateKey } from './format.js';
import { glyph, glyphSVG } from './glyphs.js';

let viewing = null; // 正在看的日期；null = 列表

export function openHistory() {
  viewing = null;
  renderHistory();
  document.getElementById('historyView').classList.add('active');
}
export function closeHistory() { document.getElementById('historyView').classList.remove('active'); }

export function showDay(key) {
  viewing = key;
  renderHistory();
  document.getElementById('historyView').scrollTop = 0;
}
export function backToDays() { viewing = null; renderHistory(); }

// 今天（进行中）+ 往日记录
export function allRecords() {
  const today = buildRecord(S);
  const past = getHistory();
  return today ? [today, ...past.filter(r => r.date !== today.date)] : past;
}

const isToday = r => r.date === todayKey();

// 任务段和休息段合在一起，按开始时间排序
function entries(r) {
  return [
    ...r.blocks.map(b => ({ kind:'task', ...b })),
    ...(r.rests || []).map(x => ({ kind:'rest', ...x })),
  ].sort((a, b) => a.start - b.start);
}

// 一天的结束时间：最后一段的结束；今天还没结束就算到现在
function dayEnd(r) {
  const ends = entries(r).map(e => e.end).filter(Boolean);
  const last = ends.length ? Math.max(...ends) : r.startedAt;
  return isToday(r) ? Math.max(last, Date.now()) : last;
}

const doneCount = r => r.blocks.filter(b => b.end).length;

// 08:05 – 18:10
function range(r) {
  const ends = entries(r).map(e => e.end).filter(Boolean);
  const finished = r.blocks.length && r.blocks.every(b => b.end);
  const endTxt = isToday(r) && !finished ? '进行中' : (ends.length ? fmtTime(Math.max(...ends)) : '—');
  return `${fmtTime(r.startedAt)} – ${endTxt}`;
}

function bigCount(r) {
  return `<div class="big-num">${doneCount(r)}<small>件</small></div>`;
}

// 横条：一天的整体样子
function dayStrip(r) {
  const t0 = r.startedAt, t1 = dayEnd(r), span = Math.max(t1 - t0, 60000);
  const segs = entries(r).map(e => {
    const s = e.start, end = e.end || (isToday(r) ? Date.now() : s);
    const left = (s - t0) / span * 100;
    const width = Math.max((end - s) / span * 100, 0.8);
    const cls = e.kind === 'rest' ? 'seg rest' : 'seg';
    const style = e.kind === 'rest' ? '' : `--c:${catColor(e.cat)};`;
    return `<div class="${cls}" style="${style}left:${left}%;width:${width}%"></div>`;
  }).join('');
  return `<div class="day-strip">${segs}</div>`;
}

function dayItem(r) {
  return `<div class="hist-day" onclick="showDay('${r.date}')">
    <div class="hd-top">
      <div>
        <div class="hd-date">${fmtDateKey(r.date)}${isToday(r) ? ' · 今天' : ''}</div>
        <div class="hd-meta">${range(r)}</div>
      </div>
      ${bigCount(r)}
    </div>
    ${dayStrip(r)}
  </div>`;
}

function timelineRow(e, r) {
  const endTxt = e.end ? fmtTime(e.end) : (isToday(r) ? '进行中' : '未完成');
  const dur = e.end ? fmtDur(e.end - e.start) : '';
  if (e.kind === 'rest') {
    return `<div class="tl-row tl-rest">
      <div class="tl-time">${fmtTime(e.start)}<span>${endTxt}</span></div>
      <div class="tl-bar"></div>
      <div class="tl-main"><div class="tl-title">休息</div><div class="tl-dur">${dur}</div></div>
    </div>`;
  }
  return `<div class="tl-row" style="--c:${catColor(e.cat)}">
    <div class="tl-time">${fmtTime(e.start)}<span>${endTxt}</span></div>
    <div class="tl-bar"></div>
    <div class="tl-main"><div class="tl-title">${glyph(e, 18)}${esc(e.title)}</div><div class="tl-dur">${dur}</div></div>
  </div>`;
}

function legend(r) {
  const used = [...new Set(r.blocks.map(b => b.cat))];
  const items = Object.entries(CATEGORIES).filter(([k]) => used.includes(k))
    .map(([k, c]) => `<span class="lg-item"><i style="background:${catColor(k)}"></i>${c.name}</span>`);
  if ((r.rests || []).length) items.push(`<span class="lg-item"><i class="lg-rest"></i>休息</span>`);
  return items.length ? `<div class="legend">${items.join('')}</div>` : '';
}

function dayDetail(r) {
  return `<div class="hist-detail">
    <button class="text-link back-link" onclick="backToDays()">← 全部记录</button>
    <div class="hd-top">
      <div>
        <div class="page-title">${fmtDateKey(r.date)}</div>
        <div class="page-sub">${isToday(r) ? '今天 · ' : ''}${range(r)}</div>
      </div>
      ${bigCount(r)}
    </div>
    ${dayStrip(r)}
    ${legend(r)}
    <div class="timeline">
      <div class="tl-mark">${glyphSVG('sun', 16)} ${fmtTime(r.startedAt)} 开始今天</div>
      ${entries(r).map(e => timelineRow(e, r)).join('')}
    </div>
  </div>`;
}

function renderHistory() {
  const body = document.getElementById('historyBody');
  const recs = allRecords();
  if (viewing) {
    const r = recs.find(x => x.date === viewing);
    if (r) { body.innerHTML = dayDetail(r); return; }
    viewing = null;
  }
  body.innerHTML = recs.length
    ? `<div class="page-title">每天的样子</div>` + recs.map(dayItem).join('')
    : `<div class="page-title">每天的样子</div><div class="hist-empty">还没有记录。<br>点"开始今天"之后，这里会自动记下每件事几点到几点。</div>`;
}
