// 任务类别和颜色：卡片和记录页共用这一份
// 颜色本身定义在 CSS 变量里（src/styles/main.css 的 --cat-*），深浅色主题各一套
// → Swift: Models/Category.swift + Assets 颜色

export const CATEGORIES = {
  meal:   { name:'餐食' },  // 朱红
  focus:  { name:'专注' },  // 钴蓝
  health: { name:'健康' },  // 琥珀
  life:   { name:'生活' },  // 墨黑
  other:  { name:'其他' },  // 石灰
};

// 老数据没有 cat 字段时，按 id 推断
const RULES = [
  [/^(breakfast|lunch|dinner)$/,                                   'meal'],
  [/^(study|work|jobs)$|^(meeting|call|read)/,                     'focus'],
  [/^(gym|supps)$/,                                                'health'],
  [/^(leave|commute|nap|break|meditate|slack|errand|message)/,     'life'],
];

export function categoryOf(task) {
  if (task.cat && CATEGORIES[task.cat]) return task.cat;
  for (const [re, cat] of RULES) if (re.test(task.id)) return cat;
  return 'other';
}

const valid = cat => (CATEGORIES[cat] ? cat : 'other');

// 类别主色（用在小圆点、时间轴、色条）
export function catColor(cat) {
  return `var(--cat-${valid(cat)})`;
}

// 卡片用的一组变量：底色、文字色、圆按钮色
export function catVars(cat) {
  const c = valid(cat);
  return `--task-color:var(--cat-${c});--task-fg:var(--cat-${c}-fg);--task-btn:var(--cat-${c}-btn);--task-btn-fg:var(--cat-${c}-btnfg)`;
}
