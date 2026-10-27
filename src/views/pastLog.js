// 往日记录（设置里）：按天列出做了什么、几点到几点，以及完成那一刻的描述和第一步
// 点日期打开那天的时间轴
// → Swift: Views/PastLogView.swift

import { allRecords, openDay } from './history.js';
import { catColor } from '../models/categories.js';
import { glyph } from './glyphs.js';
import { esc, fmtTime, fmtDateKey, fmtDur } from './format.js';
import { t, tt, loc } from '../i18n/index.js';

export function openPastLog() {
  renderPastLog();
  const view = document.getElementById('pastLogView');
  view.classList.add('active');
  view.scrollTop = 0;
}
export function closePastLog() { document.getElementById('pastLogView').classList.remove('active'); }

function itemHTML(b) {
  const hint = b.hint ? loc(b.id, 'hint', b.hint) : '';
  const notes = [
    b.starter && `<div class="pl-note"><span>${t('log.step')}</span>${esc(b.starter)}</div>`,
    hint && `<div class="pl-note"><span>${t('log.note')}</span>${esc(hint)}</div>`,
  ].filter(Boolean).join('');
  return `<div class="pl-item" style="--c:${catColor(b.cat)}">
    <div class="pl-time">${fmtTime(b.start)}<span>${fmtTime(b.end)}</span></div>
    <div class="pl-bar"></div>
    <div class="pl-main">
      <div class="pl-title">${glyph(b, 18)}${esc(tt(b, 'title'))}<span class="pl-dur">${fmtDur(b.end - b.start)}</span></div>
      ${notes}
    </div>
  </div>`;
}

function renderPastLog() {
  // 只列做完的事
  const days = allRecords()
    .map(r => ({ ...r, done:r.blocks.filter(b => b.end) }))
    .filter(r => r.done.length);
  document.getElementById('pastLogBody').innerHTML = days.length
    ? days.map(r => `
      <section class="pl-day">
        <button class="pl-head" onclick="openDayFromLog('${r.date}')">
          <span class="pl-date">${fmtDateKey(r.date)}</span>
          <span class="big-num">${r.done.length}<small>${t('log.count')}</small></span>
        </button>
        ${r.done.map(itemHTML).join('')}
      </section>`).join('')
    : `<div class="hist-empty">${t('log.none')}</div>`;
}

export function openDayFromLog(key) { openDay(key); }
