// "换一个"：现在不想做这件，可以挑别的、放到最后，或者今天跳过
// → Swift: Views/SwapSheet.swift

import { S, currentIdx, isResolved, starterOf, bringToFront, moveToEnd, skipTask } from '../store/store.js';
import { categoryOf, catColor } from '../models/categories.js';
import { esc } from './format.js';
import { glyph } from './glyphs.js';
import { t, tt } from '../i18n/index.js';
import { render } from './render.js';

const modal = () => document.getElementById('swapModal');

export function openSwap() {
  const ci = currentIdx();
  const cur = S.chain[ci];
  if (!cur) return;
  const others = S.chain.filter((task, i) => i > ci && !isResolved(task.id));

  modal().querySelector('.modal-box').innerHTML = `
    <div class="modal-title">${t('swap.title')}</div>
    <div class="swap-sub">${t('swap.sub', {t:esc(tt(cur, 'title'))})}</div>
    ${others.length ? `<div class="swap-label">${t('swap.pick')}</div>
    <div class="swap-list">${others.map(task => {
      const step = starterOf(task);
      return `<div class="swap-item" style="--c:${catColor(categoryOf(task))}" onclick="chooseNext('${task.id}')">
        <span class="swap-icon">${glyph(task, 20)}</span>
        <span class="swap-text"><span class="swap-title">${esc(tt(task, 'title'))}</span>${step ? `<span class="swap-step">${esc(step)}</span>` : ''}</span>
      </div>`;
    }).join('')}</div>` : ''}
    <div class="modal-actions col">
      ${others.length ? `<button class="btn-ghost wide" onclick="laterCurrent()">${t('swap.later')}</button>` : ''}
      <button class="btn-ghost wide" onclick="skipCurrent()">${t('swap.skip', {t:esc(tt(cur, 'title'))})}</button>
      <button class="text-link" onclick="closeSwap()">${t('swap.cancel')}</button>
    </div>`;
  modal().classList.remove('hidden');
}

export function closeSwap() { modal().classList.add('hidden'); }

function done() { closeSwap(); render(); window.scrollTo({top:0,behavior:'smooth'}); }

export function chooseNext(id) { bringToFront(id); done(); }
export function laterCurrent() { moveToEnd(S.chain[currentIdx()].id); done(); }
export function skipCurrent()  { skipTask(S.chain[currentIdx()].id); done(); }

export function initSwap() {
  modal().addEventListener('click', e => { if (e.target === modal()) closeSwap(); });
}
