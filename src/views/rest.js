// 休息：完成一件事后页面变灰，底部出现休息卡片。没有倒计时，休息到想继续为止。
// → Swift: Views/RestView.swift, Views/RemindPicker.swift
//
// 三种状态：
//   选提醒   刚做完 / 点了"等下做"：多久后提醒你？
//   休息中   显示下一件和它的第一步，"我准备好了"随时开始
//   该开始了 到了提醒时间："现在可以：把锅放到灶上"，现在做 / 等下做

import {
  S, currentIdx, starterOf, setReminder, reopenReminderPicker, endRest,
  reminderDue, markReminderFired,
} from '../store/store.js';
import { askPermission, remind } from '../services/notify.js';
import { esc, fmtTime } from './format.js';
import { I } from './icons.js';
import { glyph } from './glyphs.js';
import { categoryOf, catVars } from '../models/categories.js';
import { render } from './render.js';

const CHOICES = [[5, '5 分钟'], [15, '15 分钟'], [30, '30 分钟'], [60, '1 小时']];

function nextPreview(task) {
  const step = starterOf(task);
  return `<div class="next-row" style="${catVars(categoryOf(task))}">
    <div class="section-label">接下来</div>
    <div class="next-title"><span class="dot"></span>${glyph(task, 22)}${esc(task.title)}</div>
    ${step ? `<div class="next-step">第一步：${esc(step)}</div>` : ''}
  </div>`;
}

function pickerHTML(task) {
  const again = S.rest.again;
  return `<div class="rest-card">
    <div class="rest-title">${again ? '好，再休息一会儿' : '做完了。'}</div>
    <div class="rest-sub">${again ? '多久后再提醒你？' : '休息一下。多久后提醒你开始下一件？'}</div>
    ${nextPreview(task)}
    <div class="chips">
      ${CHOICES.map(([m, label]) => `<button class="chip" onclick="chooseReminder(${m})">${label}</button>`).join('')}
      <button class="chip" onclick="chooseReminder(null)">不用提醒</button>
    </div>
    <button class="text-link" onclick="startNext()">不休息，直接开始下一件</button>
  </div>`;
}

function restingHTML(task) {
  const r = S.rest;
  const remindLine = r.remindAt
    ? `会在 ${fmtTime(r.remindAt)} 提醒你 · <button class="text-link inline" onclick="snoozeRest()">改</button>`
    : `不会提醒你 · <button class="text-link inline" onclick="snoozeRest()">设个提醒</button>`;
  return `<div class="rest-card">
    <div class="rest-title">休息中</div>
    <div class="rest-sub">不用急，休息到想继续为止</div>
    ${nextPreview(task)}
    <div class="rest-remind">${remindLine}</div>
    <button class="btn-primary wide" onclick="startNext()">我准备好了，开始 ${I.arrow}</button>
    <button class="text-link" onclick="openSwap()">换一个</button>
  </div>`;
}

function dueHTML(task) {
  const step = starterOf(task);
  return `<div class="rest-card hero due" style="${catVars(categoryOf(task))}">
    <div class="hero-kicker">可以开始了 · ${esc(task.title)}</div>
    <div class="hero-title">${step ? `现在可以：<br>${esc(step)}` : `现在可以开始<br>「${esc(task.title)}」`}</div>
    <div class="hero-foot">
      <button class="circle-btn" onclick="startNext()"><span>现在做</span>${I.arrow}</button>
      <div class="hero-actions"><button class="act" onclick="snoozeRest()">${I.undo}<span>等下做</span></button></div>
    </div>
  </div>`;
}

export function renderRest() {
  const sheet = document.getElementById('restSheet');
  const task = S.rest && S.chain[currentIdx()];
  document.body.classList.toggle('resting', !!task);
  if (!task) { sheet.innerHTML = ''; return; }
  const state = !('remindAt' in S.rest) ? 'pick' : reminderDue() ? 'due' : 'resting';
  // 内容没变就不重画，避免每次 render 都重播滑入动画
  const key = [state, task.id, S.rest.remindAt, S.rest.again, starterOf(task)].join('|');
  if (sheet.dataset.key === key && sheet.innerHTML) return;
  sheet.dataset.key = key;
  sheet.innerHTML = state === 'pick' ? pickerHTML(task) : state === 'due' ? dueHTML(task) : restingHTML(task);
}

// ── 按钮处理 ──
export function chooseReminder(minutes) {
  if (minutes != null) askPermission();
  setReminder(minutes);
  render();
}

export function snoozeRest() {
  reopenReminderPicker();
  render();
}

export function startNext() {
  endRest();
  if (navigator.vibrate) navigator.vibrate(30);
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

// 定时检查：到时间就提醒一次
export function checkReminder() {
  if (!reminderDue()) return;
  if (!S.rest.fired) {
    markReminderFired();
    const task = S.chain[currentIdx()];
    const step = task && starterOf(task);
    if (task) remind('可以开始了', step ? `现在可以：${step}` : `现在可以开始「${task.title}」了`);
  }
  renderRest();
}
