// 整页重新渲染
import { renderRail, renderStartCard, renderChain, initSortable } from './chain.js';
import { renderPalette } from './palette.js';
import { renderRest } from './rest.js';
import { renderBadge } from './calendar.js';

export function render() {
  renderRail();
  renderStartCard();
  renderChain();
  renderPalette();
  renderRest();
  renderBadge(); // 左上角日期的圆环跟着今天的进度变
  initSortable();
}
