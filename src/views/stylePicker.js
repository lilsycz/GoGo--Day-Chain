// 编辑模式里点任务左边的色点 + 图标：选颜色（类别）和图标，点了马上生效（只改今天）
// 没有文字：上面一排 5 个颜色圆，下面一格格图标
// → Swift: Views/StylePicker.swift

import { S, updateTaskField } from '../store/store.js';
import { CATEGORIES, catColor, categoryOf } from '../models/categories.js';
import { GLYPH_CHOICES, glyphSVG, glyphName, glyph } from './glyphs.js';
import { esc } from './format.js';
import { t, tt } from '../i18n/index.js';
import { render } from './render.js';

let taskId = null;
const modal = () => document.getElementById('styleModal');

export function openStylePicker(id) {
  taskId = id;
  renderPicker();
  modal().classList.remove('hidden');
}
export function closeStylePicker() { modal().classList.add('hidden'); }

function renderPicker() {
  const task = S.chain.find(x => x.id === taskId);
  if (!task) { closeStylePicker(); return; }
  const cat = categoryOf(task), g = glyphName(task);
  modal().querySelector('.modal-box').innerHTML = `
    <div class="style-head" style="--c:${catColor(cat)}">
      <span class="style-preview">${glyph(task, 26)}</span>
      <span class="style-title">${esc(tt(task, 'title'))}</span>
    </div>
    <div class="color-row">${Object.keys(CATEGORIES).map(k =>
      `<button class="color-dot${k === cat ? ' on' : ''}" style="--c:${catColor(k)}" onclick="pickStyle('cat','${k}')" aria-label="${t('cat.' + k)}"></button>`
    ).join('')}</div>
    <div class="glyph-picker">${GLYPH_CHOICES.map(name =>
      `<button type="button" class="gp-item${name === g ? ' on' : ''}" onclick="pickStyle('glyph','${name}')" aria-label="${name}">${glyphSVG(name, 22)}</button>`
    ).join('')}</div>`;
}

export function pickStyle(field, val) {
  updateTaskField(taskId, field, val);
  render();
  renderPicker();
}

export function initStylePicker() {
  modal().addEventListener('click', e => { if (e.target === modal()) closeStylePicker(); });
}
