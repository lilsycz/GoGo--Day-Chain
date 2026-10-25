// 底部小提示，可以带一个按钮（比如"撤销"）

let timer = null;

export function showToast(msg, actionLabel, onAction, ms = 5000) {
  const el = document.getElementById('toast');
  el.innerHTML = `<span>${msg}</span>${actionLabel ? `<button>${actionLabel}</button>` : ''}`;
  const btn = el.querySelector('button');
  if (btn) btn.onclick = () => { hideToast(); onAction(); };
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(hideToast, ms);
}

function hideToast() {
  clearTimeout(timer);
  document.getElementById('toast').classList.remove('show');
}
