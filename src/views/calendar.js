// 日历：每天一个圆，外面一圈细圆环，按做事的先后、花的时间分段着色
// 点左上角日期打开；点有记录的日子跳到那天的时间轴
// → Swift: Views/CalendarView.swift, Views/DayRing.swift

import { S, todayKey, buildRecord } from '../store/store.js';
import { CATEGORIES, catColor } from '../models/categories.js';
import { allRecords, openHistory, showDay } from './history.js';

let ym = null; // 正在看的 [年, 月(0-11)]

// 一天的圆环 SVG。没有记录时只画一圈底色
export function dayRing(rec, size = 44, stroke = 2.5) {
  const cx = size / 2, r = cx - stroke / 2 - 0.5, c = 2 * Math.PI * r;
  let segs = '';
  if (rec && rec.blocks.length) {
    const live = rec.date === todayKey();
    // 每段至少按 1 分钟算，保证都看得见
    const parts = rec.blocks.map(b => ({
      cat: b.cat,
      d: Math.max((b.end || (live ? Date.now() : b.start)) - b.start, 60000),
    }));
    const total = parts.reduce((a, p) => a + p.d, 0);
    const gap = parts.length > 1 ? Math.min(2, c * 0.012) : 0;
    let off = 0;
    segs = parts.map(p => {
      const len = c * p.d / total;
      const vis = Math.max(len - gap, 0.8);
      const s = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" style="stroke:${catColor(p.cat)}" stroke-width="${stroke}" stroke-dasharray="${vis} ${c}" stroke-dashoffset="${-off}"/>`;
      off += len;
      return s;
    }).join('');
  }
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <g transform="rotate(-90 ${cx} ${cx})">
      <circle class="ring-track" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke-width="${stroke}"/>${segs}
    </g></svg>`;
}

const WEEKDAYS = ['周日','周一','周二','周三','周四','周五','周六'];

// 左上角的日期圆：今天的圆环 + 星期 + 日
export function renderBadge() {
  const [y, m, d] = S.date.split('-').map(Number);
  const wd = WEEKDAYS[new Date(y, m-1, d).getDay()];
  document.getElementById('dateBadge').innerHTML =
    dayRing(buildRecord(S), 60, 2.5) + `<span class="db-wd">${wd}</span><span class="db-d">${d}</span>`;
}

export function openCalendar() {
  const [y, m] = S.date.split('-').map(Number);
  ym = [y, m - 1];
  renderCalendar();
  document.getElementById('calendarView').classList.add('active');
}

export function closeCalendar() { document.getElementById('calendarView').classList.remove('active'); }

export function shiftMonth(delta) {
  const d = new Date(ym[0], ym[1] + delta, 1);
  ym = [d.getFullYear(), d.getMonth()];
  renderCalendar();
}

// 从日历点进某一天：打开记录页的那天（关掉记录页会回到日历）
export function openDayFromCalendar(key) {
  openHistory();
  showDay(key);
}

const pad = n => String(n).padStart(2, '0');

function renderCalendar() {
  const [y, m] = ym;
  const recs = new Map(allRecords().map(r => [r.date, r]));
  const tk = todayKey();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7; // 周一开头

  let cells = '<span></span>'.repeat(lead);
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${pad(m + 1)}-${pad(d)}`;
    const rec = recs.get(key);
    const cls = 'cal-day' + (key === tk ? ' today' : '') + (key > tk ? ' future' : '') + (rec ? ' has' : '');
    cells += rec
      ? `<button class="${cls}" onclick="openDayFromCalendar('${key}')" aria-label="${m+1}月${d}日">${dayRing(rec)}<span>${d}</span></button>`
      : `<div class="${cls}">${key > tk ? '' : dayRing(null)}<span>${d}</span></div>`;
  }

  const legend = Object.entries(CATEGORIES)
    .map(([k, c]) => `<span class="lg-item"><i style="background:${catColor(k)}"></i>${c.name}</span>`).join('');

  document.getElementById('calendarBody').innerHTML = `
    <div class="cal-head">
      <button class="icon-btn" onclick="shiftMonth(-1)" aria-label="上个月">‹</button>
      <div class="cal-month"><div class="page-title">${m + 1}月</div><small>${y}</small></div>
      <button class="icon-btn" onclick="shiftMonth(1)" aria-label="下个月">›</button>
    </div>
    <div class="cal-week">${['一','二','三','四','五','六','日'].map(w => `<span>${w}</span>`).join('')}</div>
    <div class="cal-grid">${cells}</div>
    <div class="legend cal-legend">${legend}</div>`;
}
