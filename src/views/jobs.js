// 求职卡片内容
// → Swift: Views/JobsSection.swift

import { SAMPLE_JOBS } from '../models/defaults.js';
import { getFeedUrl, setFeedUrl as saveFeedUrl } from '../store/storage.js';
import { fetchJobFeed } from '../services/jobFeed.js';
import { render } from './render.js';
import { promptDialog } from './dialog.js';
import { t } from '../i18n/index.js';

// 求职卡片：只有设置过数据源才显示职位列表；没设置就当普通任务（不给所有用户看设置入口）
// 设置方法：打开 app 网址时带上 ?jobfeed=你的JSON地址，会自动记住
export function jobsHTML() {
  if (!getFeedUrl()) return '';
  return `<div class="job-list" id="jobList"></div>`;
}

export function initJobs() {
  const url = new URLSearchParams(location.search).get('jobfeed');
  if (url) {
    saveFeedUrl(url);
    history.replaceState(null, '', location.pathname);
  }
}

export function loadJobs() {
  const url = getFeedUrl(); if (!url) return;
  fetchJobFeed(url).then(jobs=>{
    const el=document.getElementById('jobList'); if(!el) return;
    el.innerHTML=jobs.slice(0,6).map(j=>`<div class="job-item"><div class="job-title"><a href="${j.url||'#'}" target="_blank" style="color:inherit;text-decoration:none">${j.title}</a></div><div class="job-co">${j.company}</div></div>`).join('');
  }).catch(()=>{});
}

export async function setFeedUrl() {
  const url = await promptDialog({ title:t('jobs.prompt'), placeholder:'https://…', value:getFeedUrl() || '' });
  if (url) { saveFeedUrl(url); render(); }
}
