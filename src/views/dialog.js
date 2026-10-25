// app 自己的确认框 / 输入框，替代浏览器的 confirm() / prompt()
// → Swift: .confirmationDialog / .alert

import { esc } from './format.js';
import { t } from '../i18n/index.js';

const modal = () => document.getElementById('dialogModal');
let resolveFn = null;

function open(html, onReady) {
  document.getElementById('dialogBox').innerHTML = html;
  modal().classList.remove('hidden');
  onReady?.();
  return new Promise(res => { resolveFn = res; });
}

function close(value) {
  modal().classList.add('hidden');
  const r = resolveFn; resolveFn = null;
  r?.(value);
}

// 返回 Promise<boolean>
export function confirmDialog({ title, body = '', ok = t('ok'), cancel = t('cancel'), danger = false }) {
  return open(`
    <div class="modal-title">${esc(title)}</div>
    ${body ? `<div class="modal-note">${esc(body)}</div>` : ''}
    <div class="modal-actions">
      <button class="btn-primary${danger ? ' danger' : ''}" data-v="1">${esc(ok)}</button>
      <button class="btn-ghost" data-v="0">${esc(cancel)}</button>
    </div>`, () => {
    document.querySelectorAll('#dialogBox [data-v]').forEach(b => b.onclick = () => close(b.dataset.v === '1'));
  });
}

// 返回 Promise<string|null>
export function promptDialog({ title, placeholder = '', value = '', ok = t('save') }) {
  return open(`
    <div class="modal-title">${esc(title)}</div>
    <div class="modal-field"><input id="dialogInput" type="text" placeholder="${esc(placeholder)}" value="${esc(value)}"></div>
    <div class="modal-actions">
      <button class="btn-primary" data-v="1">${esc(ok)}</button>
      <button class="btn-ghost" data-v="0">${esc(t('cancel'))}</button>
    </div>`, () => {
    const input = document.getElementById('dialogInput');
    const submit = () => close(input.value.trim() || null);
    document.querySelector('#dialogBox [data-v="1"]').onclick = submit;
    document.querySelector('#dialogBox [data-v="0"]').onclick = () => close(null);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    setTimeout(() => input.focus(), 50);
  });
}

export function initDialog() {
  modal().addEventListener('click', e => { if (e.target === modal()) close(null); });
}
