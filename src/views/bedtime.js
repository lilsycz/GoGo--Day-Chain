// 睡前清单浮层
// → Swift: Views/BedtimeView.swift

import { S, nightItems, toggleCheck, setFirstThings, updateNightItemLabel } from '../store/store.js';
import { I } from './icons.js';
import { stripEmoji } from './glyphs.js';
import { startInlineEdit } from './edit.js';
import { render } from './render.js';

export function openBedtime() {
  document.getElementById('bedtimeView').classList.add('active');
  renderNightChecklist();
  document.getElementById('studyFirst').value = S.studyFirst||'';
  document.getElementById('workFirst').value  = S.workFirst||'';
}

function renderNightChecklist() {
  document.getElementById('nightChecklist').innerHTML = nightItems.map(item => {
    const chk=!!S.checks[item.id];
    return `<div class="night-row${chk?' checked':''}" data-item-id="${item.id}" onclick="toggleNight('${item.id}',this)">
      <div class="cbox">${chk?I.check:''}</div><div class="clabel">${stripEmoji(item.label)}</div>
    </div>`;
  }).join('');
}

export function closeBedtime() { document.getElementById('bedtimeView').classList.remove('active'); }

export function toggleNight(id, el) {
  const chk = toggleCheck(id);
  el.className=`night-row${chk?' checked':''}`;
  el.querySelector('.cbox').innerHTML=chk?I.check:'';
}

export function saveBedtime() {
  setFirstThings(
    document.getElementById('studyFirst').value.trim(),
    document.getElementById('workFirst').value.trim(),
  );
  closeBedtime(); render();
}

// 点击条目文字可以直接改名
export function initBedtime() {
  document.getElementById('nightChecklist').addEventListener('click', e => {
    const clabelEl = e.target.closest('.clabel');
    if (!clabelEl || clabelEl.dataset.editing) return;
    const nightRow = clabelEl.closest('[data-item-id]');
    if (!nightRow) return;
    const item = nightItems.find(it => it.id === nightRow.dataset.itemId);
    if (!item) return;
    startInlineEdit(clabelEl, item.label, val => {
      updateNightItemLabel(item.id, val); renderNightChecklist();
    });
  });
}
