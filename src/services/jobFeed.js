// 拉取求职 JSON
// → Swift: Services/JobFeedService.swift

export function fetchJobFeed(url) {
  return fetch(url).then(r => r.json());
}
