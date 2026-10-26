// Service worker：
// 1. 代码和样式：联网时每次都向服务器确认是不是最新的（有 ETag，没变就很快），
//    避免手机上新旧文件混在一起
// 2. 每次拿到的文件都存一份，断网时用存下来的，app 也能离线打开
// 3. 页面本身照常从网络加载，只有断网时才用缓存
// 4. 拖拽库、字体这些外部文件很少变，优先用缓存

const CACHE = 'gogo-v1';
const CDN = /(^|\.)cdnjs\.cloudflare\.com$|(^|\.)fonts\.googleapis\.com$|(^|\.)fonts\.gstatic\.com$/;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

function keep(key, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 页面：正常加载，断网时用存下来的那份
  if (req.mode === 'navigate') {
    const key = url.origin + url.pathname;
    e.respondWith(
      fetch(req).then(res => keep(key, res))
        .catch(() => caches.match(key).then(hit => hit || caches.match(url.origin + url.pathname.replace(/[^/]*$/, ''))))
    );
    return;
  }

  // 自己的代码 / 样式：先问服务器，断网再用缓存
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req.url, { cache:'no-cache', credentials:'same-origin' })
        .then(res => keep(req.url, res))
        .catch(() => caches.match(req.url, { ignoreSearch:true }))
    );
    return;
  }

  // 外部库和字体：先用缓存
  if (CDN.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => keep(req, res))));
  }
});
