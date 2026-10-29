// 模版：编辑页最下面两个按钮 [存为模版] [换模版]，各打开一个底部面板
// 尽量不靠文字：当前模版带 ✓，每个模版用一串类别色小圆点预览；换了立刻生效，底部提示里可以撤销
// → Swift: Views/TemplateSheets.swift

import {
  getTemplates, activeTemplateId, applyTemplate, saveTemplate, deleteTemplate, restoreTplSnapshot,
} from '../store/store.js';
import { categoryOf, catColor } from '../models/categories.js';
import { confirmDialog } from './dialog.js';
import { showToast } from './toast.js';
import { esc } from './format.js';
import { I } from './icons.js';
import { t } from '../i18n/index.js';
import { editMode } from './edit.js';
import { render } from './render.js';
import * as haptic from '../services/haptics.js';

const sheet = () => document.getElementById('tplModal');

// 内置名字跟着语言走
export function templateName(tpl) {
  if (tpl.id === 'generic') return t('tpl.generic');
  if (tpl.id === 'personal' && tpl.name === '个人') return t('tpl.personal');
  return tpl.name;
}

// 一串小圆点：这套任务的颜色节奏
function preview(tpl) {
  return `<span class="tpl-dots">${tpl.chain.map(task => `<i style="background:${catColor(categoryOf(task))}"></i>`).join('')}</span>`;
}

// 编辑页最下面的两个按钮
export function renderEditFooter() {
  const box = document.getElementById('editFooter');
  if (!box) return;
  box.innerHTML = editMode ? `
    <button class="tpl-link" onclick="openSaveTemplate()">${I.saveFill}<span>${t('tpl.saveAs')}</span></button>
    <button class="tpl-link" onclick="openSwitchTemplate()">${I.swap}<span>${t('tpl.switch')}</span></button>` : '';
}

function openSheet(html) {
  sheet().querySelector('.modal-box').innerHTML = html;
  sheet().classList.remove('hidden');
}
export function closeTemplateSheet() { sheet().classList.add('hidden'); }

// ── 换模版：一行一个，点了立刻换 ──
export function openSwitchTemplate() {
  const active = activeTemplateId();
  openSheet(`
    <div class="modal-title">${t('tpl.switch')}</div>
    <div class="tpl-list">${getTemplates().map(tpl => `
      <div class="tpl-row${tpl.id === active ? ' on' : ''}">
        <button class="tpl-pick" onclick="switchTemplate('${tpl.id}')">
          <span class="tpl-row-name">${esc(templateName(tpl))}</span>
          ${preview(tpl)}
        </button>
        ${tpl.id === active ? `<span class="tpl-check">${I.check}</span>` : ''}
        ${tpl.builtin ? '' : `<button class="tpl-del" onclick="removeTemplate('${tpl.id}')" aria-label="${t('remove')}">×</button>`}
      </div>`).join('')}
    </div>`);
}

export function switchTemplate(id) {
  const tpl = getTemplates().find(x => x.id === id);
  if (!tpl) return;
  const undo = applyTemplate(id);
  haptic.tap();
  closeTemplateSheet();
  render();
  showToast(t('tpl.switched', { n:esc(templateName(tpl)) }), t('undo'), () => { restoreTplSnapshot(undo); render(); });
}

export async function removeTemplate(id) {
  const tpl = getTemplates().find(x => x.id === id);
  if (!tpl) return;
  const ok = await confirmDialog({ title:t('tpl.delTitle', { n:templateName(tpl) }), ok:t('tpl.delOk'), danger:true });
  if (!ok) return;
  deleteTemplate(id);
  openSwitchTemplate();
}

// ── 存为模版：点已有的就覆盖它，或者填名字新建 ──
export function openSaveTemplate() {
  const active = activeTemplateId();
  const mine = getTemplates().filter(x => !x.builtin);
  openSheet(`
    <div class="modal-title">${t('tpl.saveAs')}</div>
    ${mine.length ? `<div class="tpl-list">${mine.map(tpl => `
      <div class="tpl-row${tpl.id === active ? ' on' : ''}">
        <button class="tpl-pick" onclick="saveIntoTemplate('${tpl.id}')">
          <span class="tpl-row-name">${esc(templateName(tpl))}</span>
          ${preview(tpl)}
        </button>
        ${tpl.id === active ? `<span class="tpl-check">${I.check}</span>` : ''}
      </div>`).join('')}</div>` : ''}
    <form class="tpl-new" onsubmit="event.preventDefault(); saveNewTemplate()">
      <input id="tplNewName" type="text" placeholder="${esc(t('tpl.newPh'))}" autocomplete="off" enterkeyhint="done"
        oninput="document.getElementById('tplNewBtn').disabled = !this.value.trim()">
      <button id="tplNewBtn" class="btn-primary" type="submit" disabled aria-label="${t('save')}">${I.plus}</button>
    </form>`);
}

function afterSave(tpl, undo, key) {
  closeTemplateSheet();
  render();
  showToast(t(key, { n:esc(templateName(tpl)) }), t('undo'), () => { restoreTplSnapshot(undo); render(); });
}

export function saveIntoTemplate(id) {
  const { tpl, undo } = saveTemplate({ id });
  afterSave(tpl, undo, 'tpl.overwrote');
}

export function saveNewTemplate() {
  const name = document.getElementById('tplNewName').value.trim();
  if (!name) return;
  const { tpl, undo } = saveTemplate({ name });
  afterSave(tpl, undo, 'tpl.saved');
}

export function initTemplates() {
  sheet().addEventListener('click', e => { if (e.target === sheet()) closeTemplateSheet(); });
}
