// 记录页：每天几点到几点做了什么，颜色和卡片一致
// → Swift: Views/HistoryView.swift, Views/DayTimelineView.swift

import { S, buildRecord, getHistory, todayKey } from '../store/store.js';
import { CATEGORIES, catColor } from '../models/categories.js';
import { esc, fmtTime, fmtDur, fmtDateKey } from './format.js';
import { glyph, glyphSVG } from './glyphs.js';
import { t, tt } from '../i18n/index.js';

let viewing = null; // 正在看的日期

// 打开某一天的时间轴（日历点进来的，或左上角日期 = 今天）
export function openDay(key) {
  viewing = key;
  renderHistory();
  const view = document.getElementById('historyView');
  view.classList.add('active');
  view.scrollTop = 0;
}
export function openToday() { openDay(S.date); }
export function closeHistory() { document.getElementById('historyView').classList.remove('active'); }

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
  const endTxt = isToday(r) && !finished ? t('log.ongoing') : (ends.length ? fmtTime(Math.max(...ends)) : '—');
  return `${fmtTime(r.startedAt)} – ${endTxt}`;
}

function bigCount(r) {
  return `<div class="big-num">${doneCount(r)}<small>${t('log.count')}</small></div>`;
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

function timelineRow(e, r) {
  const endTxt = e.end ? fmtTime(e.end) : (isToday(r) ? t('log.ongoing') : t('log.unfinished'));
  const dur = e.end ? fmtDur(e.end - e.start) : '';
  if (e.kind === 'rest') {
    return `<div class="tl-row tl-rest">
      <div class="tl-time">${fmtTime(e.start)}<span>${endTxt}</span></div>
      <div class="tl-bar"></div>
      <div class="tl-main"><div class="tl-title">${t('log.rest')}</div><div class="tl-dur">${dur}</div></div>
    </div>`;
  }
  return `<div class="tl-row" style="--c:${catColor(e.cat)}">
    <div class="tl-time">${fmtTime(e.start)}<span>${endTxt}</span></div>
    <div class="tl-bar"></div>
    <div class="tl-main"><div class="tl-title">${glyph(e, 18)}${esc(tt(e, 'title'))}</div><div class="tl-dur">${dur}</div></div>
  </div>`;
}

function legend(r) {
  const used = [...new Set(r.blocks.map(b => b.cat))];
  const items = Object.entries(CATEGORIES).filter(([k]) => used.includes(k))
    .map(([k, c]) => `<span class="lg-item"><i style="background:${catColor(k)}"></i>${t('cat.' + k)}</span>`);
  if ((r.rests || []).length) items.push(`<span class="lg-item"><i class="lg-rest"></i>${t('log.rest')}</span>`);
  return items.length ? `<div class="legend">${items.join('')}</div>` : '';
}

function dayDetail(r) {
  return `<div class="hist-detail">
    <button class="text-link back-link" onclick="backToCalendar()">${t('log.back')}</button>
    <div class="hd-top">
      <div>
        <div class="page-title">${fmtDateKey(r.date)}</div>
        <div class="page-sub">${isToday(r) ? t('log.today') : ''}${range(r)}</div>
      </div>
      ${bigCount(r)}
    </div>
    ${dayStrip(r)}
    ${legend(r)}
    <div class="timeline">
      <div class="tl-mark">${glyphSVG('sun', 16)} ${t('log.started', {time:fmtTime(r.startedAt)})}</div>
      ${entries(r).map(e => timelineRow(e, r)).join('')}
    </div>
  </div>`;
}

function emptyDay(key) {
  const today = key === todayKey();
  return `<div class="hist-detail">
    <button class="text-link back-link" onclick="backToCalendar()">${t('log.back')}</button>
    <div class="page-title">${fmtDateKey(key)}</div>
    <div class="hist-empty">${today
      ? t('log.notStarted')
      : t('log.empty')}</div>
  </div>`;
}

function renderHistory() {
  const r = allRecords().find(x => x.date === viewing);
  document.getElementById('historyBody').innerHTML = r ? dayDetail(r) : emptyDay(viewing);
}
