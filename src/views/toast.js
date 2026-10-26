// 底部小提示，可以带一个按钮（比如"撤销"）
// 停留时间：带撤销的 3 秒（给一点反悔的时间），只是告知的 1.8 秒；点一下提示就立刻收起

let timer = null;

export function showToast(msg, actionLabel, onAction, ms) {
  const el = document.getElementById('toast');
  el.innerHTML = `<span>${msg}</span>${actionLabel ? `<button>${actionLabel}</button>` : ''}`;
  const btn = el.querySelector('button');
  if (btn) btn.onclick = e => { e.stopPropagation(); hideToast(); onAction(); };
  el.onclick = hideToast;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(hideToast, ms ?? (actionLabel ? 3000 : 1800));
}

function hideToast() {
  clearTimeout(timer);
  document.getElementById('toast').classList.remove('show');
}
