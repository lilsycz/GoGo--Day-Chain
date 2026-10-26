// 导出 / 导入备份
// 导出：生成 gogo-backup-日期.json；手机上走系统分享（可以存到"文件"或 iCloud Drive）
// 导入：选一个备份文件，确认后替换这台设备上的数据，然后重新载入
// → Swift: 以后换成 iCloud 同步，这里的文件格式可以用来从网页版迁移

import { S, persist } from '../store/store.js';
import { exportAll, importAll } from '../store/storage.js';
import { confirmDialog } from './dialog.js';
import { showToast } from './toast.js';
import { t } from '../i18n/index.js';

export async function exportData() {
  persist(); // 先把内存里最新的状态写进去
  const json = JSON.stringify(exportAll(), null, 2);
  const name = `gogo-backup-${S.date}.json`;
  const blob = new Blob([json], { type:'application/json' });

  // 手机：系统分享面板
  try {
    const file = new File([blob], name, { type:'application/json' });
    if (navigator.canShare?.({ files:[file] })) {
      await navigator.share({ files:[file], title:name });
      showToast(t('export.done'));
      return;
    }
  } catch (e) {
    if (e?.name === 'AbortError') return; // 用户关掉了分享面板
  }

  // 电脑：直接下载
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  showToast(t('export.done'));
}

export function importData() {
  document.getElementById('importFile').click();
}

async function onFileChosen(e) {
  const file = e.target.files?.[0];
  e.target.value = ''; // 同一个文件可以再选一次
  if (!file) return;
  let backup;
  try { backup = JSON.parse(await file.text()); } catch { backup = null; }
  if (!backup || backup.app !== 'gogo-day-chain') { showToast(t('import.bad')); return; }

  const ok = await confirmDialog({ title:t('import.title'), body:t('import.body'), ok:t('import.ok'), danger:true });
  if (!ok) return;
  if (!importAll(backup)) { showToast(t('import.bad')); return; }
  location.reload();
}

export function initBackup() {
  document.getElementById('importFile').addEventListener('change', onFileChosen);
}
