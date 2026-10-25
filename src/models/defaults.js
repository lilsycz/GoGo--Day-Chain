// 默认数据：默认任务链、调板模板、睡前清单、示例职位
// → Swift: Models/

export const DEFAULT_TASKS = [
  { id:'breakfast', cat:'meal', icon:'🥣', title:'早餐',   hint:'酸奶在冰箱 · 麦片在桌上', type:'simple',     btnLabel:'吃完了' },
  { id:'leave', cat:'life',     icon:'🎒', title:'出门',   hint:'全部打勾才能出门',         type:'checklist',  btnLabel:'背包确认 · 出门',
    items:[{id:'cl',label:'💻 电脑'},{id:'cc',label:'🔌 充电器'},{id:'ce',label:'🎧 耳机'},{id:'cw',label:'💧 水杯'},{id:'cg',label:'👕 运动服（已装）'}] },
  { id:'study', cat:'focus',  icon:'📚', title:'学习',   hint:null, type:'first-thing', ftKey:'studyFirst', btnLabel:'学完了' },
  { id:'lunch', cat:'meal',  icon:'🍱', title:'午餐',   hint:null, type:'simple',     btnLabel:'吃完了' },
  { id:'jobs', cat:'focus',   icon:'💼', title:'今日求职', hint:null, type:'jobs',     btnLabel:'已查阅' },
  { id:'work', cat:'focus',   icon:'🖥', title:'工作',   hint:null, type:'first-thing', ftKey:'workFirst', btnLabel:'工作完成' },
  { id:'gym', cat:'health',    icon:'🏋️', title:'健身',  hint:'运动服在包里', type:'simple', btnLabel:'练完了' },
  { id:'dinner', cat:'meal', icon:'🍽', title:'晚饭',   hint:null, type:'simple',     btnLabel:'吃完了' },
  { id:'supps', cat:'health',  icon:'💊', title:'补剂',   hint:null, type:'simple',     btnLabel:'今天完成 🎉' },
];

export const PAL_TEMPLATES = [
  {templateId:'meeting', cat:'focus', icon:'📋', title:'会议',  btnLabel:'开完了'},
  {templateId:'call', cat:'focus',    icon:'📞', title:'电话',  btnLabel:'打完了'},
  {templateId:'slack', cat:'life',   icon:'🐟', title:'摸鱼',  btnLabel:'摸完了'},
  {templateId:'break', cat:'life',   icon:'☕', title:'休息',  btnLabel:'休息好了'},
  {templateId:'commute', cat:'life', icon:'🚇', title:'通勤',  btnLabel:'到了'},
  {templateId:'errand', cat:'life',  icon:'🛒', title:'买菜',  btnLabel:'买完了'},
  {templateId:'message', cat:'life', icon:'💬', title:'消息',  btnLabel:'回完了'},
  {templateId:'nap', cat:'life',     icon:'😴', title:'午睡',  btnLabel:'睡醒了'},
  {templateId:'meditate', cat:'life',icon:'🧘', title:'冥想',  btnLabel:'完成了'},
  {templateId:'read', cat:'focus',    icon:'📖', title:'阅读',  btnLabel:'看完了'},
];

export const NIGHT_ITEMS = [
  {id:'nl',label:'💻 电脑装包'},{id:'nc',label:'🔌 充电器装包'},
  {id:'ne',label:'🎧 耳机装包'},{id:'nw',label:'💧 水杯装包'},{id:'ng',label:'👕 运动服装包'},
];

export const SAMPLE_JOBS = [
  {title:'Software Engineer',company:'示例公司 A · 旧金山',url:'#'},
  {title:'Frontend Developer',company:'示例公司 B · 远程',url:'#'},
  {title:'Product Designer',company:'示例公司 C · 纽约',url:'#'},
];
