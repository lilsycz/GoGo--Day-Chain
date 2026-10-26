// 编辑模式顶部的模版条：点一下切换，「＋ 存为模版」把今天调好的任务链存下来
// → Swift: Views/TemplatePicker.swift

import { getTemplates, activeTemplateId, applyTemplate, saveTemplate, deleteTemplate } from '../store/store.js';
import { confirmDialog, promptDialog } from './dialog.js';
import { showToast } from './toast.js';
import { esc } from './format.js';
import { t } from '../i18n/index.js';
import { render } from './render.js';

// 内置名字跟着语言走
export function templateName(tpl) {
  if (tpl.id === 'generic') return t('tpl.generic');
  if (tpl.id === 'personal' && tpl.name === '个人') return t('tpl.personal');
  return tpl.name;
}

export function renderTemplateBar() {
  const box = document.getElementById('tplBar');
  if (!box) return;
  const active = activeTemplateId();
  box.innerHTML = `
    <div class="tpl-label">${t('tpl.label')}</div>
    <div class="tpl-chips">
      ${getTemplates().map(tpl => `
        <span class="tpl-chip${tpl.id === active ? ' on' : ''}">
          <button class="tpl-name" onclick="switchTemplate('${tpl.id}')">${esc(templateName(tpl))}</button>
          ${tpl.builtin ? '' : `<button class="tpl-del" onclick="removeTemplate('${tpl.id}')" aria-label="${t('remove')}">×</button>`}
        </span>`).join('')}
      <button class="tpl-save" onclick="saveAsTemplate()">${t('tpl.save')}</button>
    </div>`;
}

export async function switchTemplate(id) {
  const tpl = getTemplates().find(x => x.id === id);
  if (!tpl) return;
  const name = templateName(tpl);
  const ok = await confirmDialog({ title:t('tpl.switchTitle', { n:name }), body:t('tpl.switchBody'), ok:t('tpl.switchOk') });
  if (!ok) return;
  applyTemplate(id);
  render();
  showToast(t('tpl.switched', { n:esc(name) }));
}

export async function saveAsTemplate() {
  const active = getTemplates().find(x => x.id === activeTemplateId());
  const suggest = active && !active.builtin ? templateName(active) : '';
  const name = await promptDialog({ title:t('tpl.saveTitle'), placeholder:t('tpl.namePh'), value:suggest, ok:t('save') });
  if (!name) return;
  saveTemplate(name);
  render();
  showToast(t('tpl.saved', { n:esc(name) }));
}

export async function removeTemplate(id) {
  const tpl = getTemplates().find(x => x.id === id);
  if (!tpl) return;
  const ok = await confirmDialog({ title:t('tpl.delTitle', { n:templateName(tpl) }), body:t('tpl.delBody'), ok:t('tpl.delOk'), danger:true });
  if (!ok) return;
  deleteTemplate(id);
  renderTemplateBar();
}
