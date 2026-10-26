// 睡前页：今天（圆环回顾）→ 明天（用哪个模版、第一件事的第一步）→ 睡前清单
// 尽量不靠文字：几个小标题 + 圆环 + 模版按钮 + 一个输入框
// → Swift: Views/BedtimeView.swift

import {
  S, nightItems, toggleCheck, updateNightItemLabel, buildRecord,
  getTemplates, activeTemplateId, setTomorrowTemplate, tomorrowChain,
} from '../store/store.js';
import { I } from './icons.js';
import { glyph, stripEmoji } from './glyphs.js';
import { loc, tt, t } from '../i18n/index.js';
import { esc } from './format.js';
import { startInlineEdit } from './edit.js';
import { dayRing } from './calendar.js';
import { templateName } from './templates.js';
import { stepInputHTML } from './stepInput.js';

export function openBedtime() {
  renderBedtime();
  const view = document.getElementById('bedtimeView');
  view.classList.add('active');
  view.scrollTop = 0;
}
export function closeBedtime() { document.getElementById('bedtimeView').classList.remove('active'); }

export function renderBedtime() {
  const rec = buildRecord(S);
  const done = rec ? rec.blocks.filter(b => b.end).length : 0;
  const active = activeTemplateId();
  const first = tomorrowChain()[0];

  document.getElementById('bedBody').innerHTML = `
    <div class="sec-label">${t('bed.today')}</div>
    <div class="bed-today">
      <div class="bed-ring">${dayRing(rec, 72, 3)}</div>
      <div class="big-num">${done}<small>${t('log.count')}</small></div>
    </div>

    <div class="sec-label">${t('bed.tomorrow')}</div>
    <div class="tpl-chips">${getTemplates().map(tpl =>
      `<button class="cat-chip${tpl.id === active ? ' on' : ''}" onclick="pickTomorrow('${tpl.id}')">${esc(templateName(tpl))}</button>`
    ).join('')}</div>
    ${first ? `<div class="bed-first">
      <div class="next-title">${glyph(first, 22)}${esc(tt(first, 'title'))}</div>
      ${first.starter
        ? `<div class="next-step">${t('rest.firstStep', { s:esc(first.starter) })}</div>`
        : stepInputHTML(first, { tomorrow:true })}
    </div>` : ''}

    <div class="sec-label">${t('bed.night')}</div>
    <div id="nightChecklist">${nightItems.map(item => {
      const chk = !!S.checks[item.id];
      return `<div class="night-row${chk?' checked':''}" data-item-id="${item.id}" onclick="toggleNight('${item.id}',this)">
        <div class="cbox">${chk?I.check:''}</div><div class="clabel">${esc(stripEmoji(loc(item.id, 'label', item.label)))}</div>
      </div>`;
    }).join('')}</div>`;
}

export function pickTomorrow(id) {
  setTomorrowTemplate(id);
  renderBedtime();
}

export function toggleNight(id, el) {
  const chk = toggleCheck(id);
  el.className=`night-row${chk?' checked':''}`;
  el.querySelector('.cbox').innerHTML=chk?I.check:'';
}

// 点击清单文字可以直接改名
export function initBedtime() {
  document.getElementById('bedBody').addEventListener('click', e => {
    const clabelEl = e.target.closest('#nightChecklist .clabel');
    if (!clabelEl || clabelEl.dataset.editing) return;
    e.stopPropagation();
    const item = nightItems.find(it => it.id === clabelEl.closest('[data-item-id]').dataset.itemId);
    if (!item) return;
    startInlineEdit(clabelEl, loc(item.id, 'label', item.label), val => {
      updateNightItemLabel(item.id, val); renderBedtime();
    });
  });
}
