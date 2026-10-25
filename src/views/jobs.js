// 求职卡片内容
// → Swift: Views/JobsSection.swift

import { SAMPLE_JOBS } from '../models/defaults.js';
import { getFeedUrl, setFeedUrl as saveFeedUrl } from '../store/storage.js';
import { fetchJobFeed } from '../services/jobFeed.js';
import { render } from './render.js';
import { promptDialog } from './dialog.js';
import { t } from '../i18n/index.js';

export function jobsHTML() {
  const url = getFeedUrl();
  let h = `<div class="job-list" id="jobList">` +
    SAMPLE_JOBS.map((j,i)=>`<div class="job-item"><div class="job-title">${j.title}</div><div class="job-co">${t('jobs.co' + (i+1))}</div></div>`).join('') +
    `</div>`;
  if (!url) h += `<div class="feed-hint">${t('jobs.connect')} <span class="feed-link" onclick="setFeedUrl()">${t('jobs.set')}</span></div>`;
  return h;
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
