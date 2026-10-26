// 入口：初始化各部分，并把 HTML 里 onclick="..." 用到的函数挂到 window 上
// （ES module 里的函数默认不是全局的）

import { render } from './views/render.js';
import {
  toggleShowAll, startDay, completeTask, undoLast, toggleCheck, unskipTask,
  removeTask, addToDaily, editStarter,
} from './views/chain.js';
import { chooseReminder, snoozeRest, startNext, checkReminder } from './views/rest.js';
import { initSwap, openSwap, closeSwap, chooseNext, laterCurrent, skipCurrent } from './views/swap.js';
import { openToday, closeHistory } from './views/history.js';
import { openCalendar, closeCalendar, shiftMonth, openDayFromCalendar, backToCalendar } from './views/calendar.js';
import { rollOverIfNewDay } from './store/store.js';
import {
  initPalette, openPalette, closePalette, addTpl, pickCat,
  openCustomModal, closeCustomModal, saveCustomTemplate, delCustomTemplate, pickGlyph,
} from './views/palette.js';
import { initBedtime, openBedtime, closeBedtime, toggleNight, saveBedtime } from './views/bedtime.js';
import { initEdit, toggleEditMode, setEditTarget, editField, editCheckItem } from './views/edit.js';
import { setFeedUrl } from './views/jobs.js';
import { initTopbar, updateDateLabel, toggleTheme, resetDay, openMenu, menuAction } from './views/topbar.js';
import { initDialog } from './views/dialog.js';
import { initBackup } from './views/backup.js';

Object.assign(window, {
  toggleShowAll, startDay, completeTask, undoLast, toggleCheck, unskipTask,
  removeTask, addToDaily, editStarter,
  chooseReminder, snoozeRest, startNext,
  openSwap, closeSwap, chooseNext, laterCurrent, skipCurrent,
  openToday, closeHistory,
  openCalendar, closeCalendar, shiftMonth, openDayFromCalendar, backToCalendar,
  openPalette, closePalette, addTpl, pickCat,
  openCustomModal, closeCustomModal, saveCustomTemplate, delCustomTemplate, pickGlyph,
  openBedtime, closeBedtime, toggleNight, saveBedtime,
  toggleEditMode, setEditTarget, editField, editCheckItem,
  setFeedUrl, toggleTheme, resetDay, openMenu, menuAction,
});

initTopbar();
initPalette();
initBedtime();
initEdit();
initSwap();
initDialog();
initBackup();
render();

// app 一直开着跨过凌晨 4 点，或者第二天从后台切回来时，换成新的一天
function checkNewDay() {
  if (rollOverIfNewDay()) render();
  updateDateLabel(); // 问候语跟着时段变
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') { checkNewDay(); checkReminder(); }
});
setInterval(checkNewDay, 60_000);

// 休息提醒：每 10 秒看一次到没到时间
setInterval(checkReminder, 10_000);
checkReminder();
