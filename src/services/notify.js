// 提醒：声音 + 震动 + 系统通知
// 网页版只在页面还开着时有效（切到后台的标签页也行，锁屏的 iPhone 基本不行）
// → Swift: Services/NotificationService.swift（换成 iOS 本地通知，锁屏也能弹）

function supported() { return 'Notification' in window; }

// 第一次设提醒时请求通知权限
export function askPermission() {
  if (supported() && Notification.permission === 'default') {
    try { Notification.requestPermission().catch(() => {}); } catch {}
  }
}

export function remind(title, body) {
  chime();
  if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
  if (supported() && Notification.permission === 'granted' && document.visibilityState !== 'visible') {
    try { new Notification(title, { body }); } catch {}
  }
}

// 两声轻柔的提示音
function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [660, 880].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.18;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch {}
}
