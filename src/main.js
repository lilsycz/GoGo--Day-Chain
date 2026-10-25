// 入口：初始化各部分，并把 HTML 里 onclick="..." 用到的函数挂到 window 上
// （ES module 里的函数默认不是全局的）

import { render } from './views/render.js';
import { completeTask, undoLast, toggleCheck, delTask } from './views/chain.js';
import {
  initPalette, openPalette, closePalette, addFromPalette, addCustomFromPalette,
  openCustomModal, closeCustomModal, saveCustomTemplate, delCustomTemplate,
} from './views/palette.js';
import { initBedtime, openBedtime, closeBedtime, toggleNight, saveBedtime } from './views/bedtime.js';
import { initEdit, toggleEditMode, setEditTarget, editField, editCheckItem } from './views/edit.js';
import { setFeedUrl } from './views/jobs.js';
import { initTopbar, toggleTheme, resetDay } from './views/topbar.js';

Object.assign(window, {
  completeTask, undoLast, toggleCheck, delTask,
  openPalette, closePalette, addFromPalette, addCustomFromPalette,
  openCustomModal, closeCustomModal, saveCustomTemplate, delCustomTemplate,
  openBedtime, closeBedtime, toggleNight, saveBedtime,
  toggleEditMode, setEditTarget, editField, editCheckItem,
  setFeedUrl, toggleTheme, resetDay,
});

initTopbar();
initPalette();
initBedtime();
initEdit();
render();
