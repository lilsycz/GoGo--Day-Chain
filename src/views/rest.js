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
import { stepInputHTML } from './stepInput.js';
import { t, tt, lang } from '../i18n/index.js';
import { categoryOf, catVars } from '../models/categories.js';
import { render } from './render.js';

const CHOICES = () => [[5, t('min',{n:5})], [15, t('min',{n:15})], [30, t('min',{n:30})], [60, t('hour1')]];

function nextPreview(task) {
  const step = starterOf(task);
  return `<div class="next-row" style="${catVars(categoryOf(task))}">
    <div class="section-label">${t('next')}</div>
    <div class="next-title"><span class="dot"></span>${glyph(task, 22)}${esc(tt(task, 'title'))}</div>
    ${step ? `<div class="next-step">${t('rest.firstStep', {s:esc(step)})}</div>` : stepInputHTML(task)}
  </div>`;
}

function pickerHTML(task) {
  const again = S.rest.again;
  return `<div class="rest-card">
    <div class="rest-title">${again ? t('rest.again') : t('rest.done')}</div>
    <div class="rest-sub">${again ? t('rest.askAgain') : t('rest.ask')}</div>
    ${nextPreview(task)}
    <div class="chips">
      ${CHOICES().map(([m, label]) => `<button class="chip" onclick="chooseReminder(${m})">${label}</button>`).join('')}
      <button class="chip" onclick="chooseReminder(null)">${t('rest.noRemind')}</button>
    </div>
    <button class="text-link" onclick="startNext()">${t('rest.skip')}</button>
  </div>`;
}

function restingHTML(task) {
  const r = S.rest;
  const remindLine = r.remindAt
    ? `${t('rest.willRemind', {time:fmtTime(r.remindAt)})} · <button class="text-link inline" onclick="snoozeRest()">${t('rest.change')}</button>`
    : `${t('rest.wontRemind')} · <button class="text-link inline" onclick="snoozeRest()">${t('rest.setRemind')}</button>`;
  return `<div class="rest-card">
    <div class="rest-title">${t('rest.title')}</div>
    ${nextPreview(task)}
    <div class="rest-remind">${remindLine}</div>
    <button class="btn-primary wide" onclick="startNext()">${t('rest.ready')} ${I.arrow}</button>
    <button class="text-link" onclick="openSwap()">${t('act.swap')}</button>
  </div>`;
}

function dueHTML(task) {
  const step = starterOf(task);
  return `<div class="rest-card hero due" style="${catVars(categoryOf(task))}">
    <div class="hero-kicker">${t('due.kicker', {t:esc(tt(task, 'title'))})}</div>
    <div class="hero-title">${step ? t('due.step', {s:esc(step)}) : t('due.task', {t:esc(tt(task, 'title'))})}</div>
    <div class="hero-foot">
      <button class="circle-btn" onclick="startNext()"><span>${t('due.now')}</span>${I.arrow}</button>
      <div class="hero-actions"><button class="act" onclick="snoozeRest()">${I.undo}<span>${t('due.later')}</span></button></div>
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
  const key = [state, task.id, S.rest.remindAt, S.rest.again, starterOf(task), lang].join('|');
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
    if (task) remind(t('notify.title'), step ? t('notify.step', {s:step}) : t('notify.task', {t:tt(task, 'title')}));
  }
  renderRest();
}
