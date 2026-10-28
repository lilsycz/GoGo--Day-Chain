// 震动反馈
// 安卓：navigator.vibrate
// iPhone（Safari 不支持 vibrate）：点一下隐藏的系统开关 <input switch>，iOS 18 起会轻轻震一下
// 只能在点击、按下这类用户操作里调用，不然 iOS 不会震
// → Swift: Services/Haptics.swift（UIImpactFeedbackGenerator / UINotificationFeedbackGenerator）

const canVibrate = typeof navigator.vibrate === 'function';

function iosTick() {
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.body.appendChild(label);
  label.click();
  label.remove();
}

function buzz(ms) {
  try { canVibrate ? navigator.vibrate(ms) : iosTick(); } catch {}
}

// 轻点：选中、勾选、拿起、放下
export function tap() { buzz(12); }

// 完成一件事：两下
export function success() {
  buzz(18);
  setTimeout(() => buzz(18), 110);
}

// 今天全部完成：三下
export function celebrate() {
  buzz(20);
  setTimeout(() => buzz(20), 110);
  setTimeout(() => buzz(35), 260);
}
