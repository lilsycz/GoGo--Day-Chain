// "换一个"：现在不想做这件，可以挑别的、放到最后，或者今天跳过
// → Swift: Views/SwapSheet.swift

import { S, currentIdx, isResolved, starterOf, bringToFront, moveToEnd, skipTask } from '../store/store.js';
import { categoryOf, catColor } from '../models/categories.js';
import { esc } from './format.js';
import { glyph } from './glyphs.js';
import { render } from './render.js';

const modal = () => document.getElementById('swapModal');

export function openSwap() {
  const ci = currentIdx();
  const cur = S.chain[ci];
  if (!cur) return;
  const others = S.chain.filter((t, i) => i > ci && !isResolved(t.id));

  modal().querySelector('.modal-box').innerHTML = `
    <div class="modal-title">换一个</div>
    <div class="swap-sub">现在不想做「${esc(cur.title)}」也没关系</div>
    ${others.length ? `<div class="swap-label">先做这个</div>
    <div class="swap-list">${others.map(t => {
      const step = starterOf(t);
      return `<div class="swap-item" style="--c:${catColor(categoryOf(t))}" onclick="chooseNext('${t.id}')">
        <span class="swap-icon">${glyph(t, 20)}</span>
        <span class="swap-text"><span class="swap-title">${esc(t.title)}</span>${step ? `<span class="swap-step">${esc(step)}</span>` : ''}</span>
      </div>`;
    }).join('')}</div>` : ''}
    <div class="modal-actions col">
      ${others.length ? `<button class="btn-ghost wide" onclick="laterCurrent()">放到最后，等会儿再做</button>` : ''}
      <button class="btn-ghost wide" onclick="skipCurrent()">今天跳过「${esc(cur.title)}」</button>
      <button class="text-link" onclick="closeSwap()">算了</button>
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
