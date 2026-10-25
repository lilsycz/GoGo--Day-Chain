// 整页重新渲染
import { renderRail, renderChain, initSortable } from './chain.js';
import { renderPalette } from './palette.js';

export function render() {
  renderRail();
  renderChain();
  renderPalette();
  initSortable();
}
