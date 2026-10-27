// "写下最小的第一步"输入框：出现在休息卡片和开始卡片里（事情开始之前）
// 灰色占位是这件事的例子；回车或点别处就保存，轮到它时大卡片上直接显示
// → Swift: Views/FirstStepField.swift

import { updateTaskField, setTomorrowStarter } from '../store/store.js';
import { exampleFor, t } from '../i18n/index.js';
import { esc } from './format.js';
import { render } from './render.js';

// tomorrow: 睡前页里给明天的事写（不在今天的任务链里）
export function stepInputHTML(task, { tomorrow = false, value = '' } = {}) {
  return `<label class="step-field">
    <span class="step-field-label">${t('rest.writeStep')}</span>
    <input class="step-input" type="text" data-step-for="${task.id}"${tomorrow ? ' data-tomorrow="1"' : ''} value="${esc(value)}" placeholder="${esc(exampleFor(task))}" enterkeyhint="done" autocomplete="off">
  </label>`;
}

export function initStepInputs() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList?.contains('step-input')) { e.preventDefault(); e.target.blur(); }
  });
  // 明天的第一步：每打一个字就存，切出 app 也不会丢
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.classList?.contains('step-input') && el.dataset.tomorrow) setTomorrowStarter(el.dataset.stepFor, el.value.trim());
  });
  // 页面被切走时，正在写的输入框先存下来
  document.addEventListener('visibilitychange', () => {
    const el = document.activeElement;
    if (document.hidden && el?.matches?.('input.step-input, input.inline-edit')) el.blur();
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (!el.classList?.contains('step-input')) return;
    const val = el.value.trim();
    if (!val && !el.dataset.tomorrow) return; // 明天的可以清空
    if (el.dataset.tomorrow) {
      setTomorrowStarter(el.dataset.stepFor, val);
      import('./bedtime.js').then(m => m.renderBedtime());
    } else {
      updateTaskField(el.dataset.stepFor, 'starter', val);
      render();
    }
  });
}
