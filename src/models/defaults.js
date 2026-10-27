// 默认数据：通用任务链（新用户）、个人任务链（老版本的默认，迁移成「个人」模版）、
// 插入托盘的事件、睡前清单、示例职位
// 显示的文字会经过 src/i18n/defaults.js 切换中英文
// → Swift: Models/

// 通用版：适合所有人的起点
export const DEFAULT_TASKS = [
  { id:'breakfast', cat:'meal',   glyph:'bowl',     title:'早餐', hint:null, type:'simple',      btnLabel:'吃完了' },
  { id:'leave',     cat:'life',   glyph:'bag',      title:'出门', hint:null, type:'simple',      btnLabel:'出门了' },
  { id:'work',      cat:'focus',  glyph:'laptop',   title:'工作', hint:null, type:'simple',      btnLabel:'工作完成' },
  { id:'lunch',     cat:'meal',   glyph:'box',      title:'午餐', hint:null, type:'simple',      btnLabel:'吃完了' },
  { id:'study',     cat:'focus',  glyph:'book',     title:'学习', hint:null, type:'simple',      btnLabel:'学完了' },
  { id:'gym',       cat:'health', glyph:'dumbbell', title:'运动', hint:null, type:'simple',      btnLabel:'练完了' },
  { id:'dinner',    cat:'meal',   glyph:'plate',    title:'晚饭', hint:null, type:'simple',      btnLabel:'吃完了' },
  { id:'relax',     cat:'life',   glyph:'leaf',     title:'放松', hint:null, type:'simple',      btnLabel:'放松好了' },
];

// 个人版：老版本一直用的默认任务（老用户会被自动存成「个人」模版）
export const PERSONAL_TASKS = [
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

// 插入托盘：每个类别都有几件
export const PAL_TEMPLATES = [
  // 餐食
  {templateId:'cook',     cat:'meal',   glyph:'plate',     title:'做饭',   btnLabel:'做好了'},
  {templateId:'snack',    cat:'meal',   glyph:'apple',     title:'加餐',   btnLabel:'吃完了'},
  {templateId:'water',    cat:'meal',   glyph:'drop',      title:'喝水',   btnLabel:'喝了'},
  // 专注
  {templateId:'meeting',  cat:'focus',  glyph:'people',    title:'会议',   btnLabel:'开完了'},
  {templateId:'call',     cat:'focus',  glyph:'phone',     title:'电话',   btnLabel:'打完了'},
  {templateId:'read',     cat:'focus',  glyph:'glasses',   title:'阅读',   btnLabel:'看完了'},
  {templateId:'write',    cat:'focus',  glyph:'pen',       title:'写作',   btnLabel:'写完了'},
  {templateId:'email',    cat:'focus',  glyph:'mail',      title:'回邮件', btnLabel:'回完了'},
  {templateId:'review',   cat:'focus',  glyph:'book',      title:'复习',   btnLabel:'复习完了'},
  // 健康
  {templateId:'walk',     cat:'health', glyph:'walk',      title:'散步',   btnLabel:'走完了'},
  {templateId:'exercise', cat:'health', glyph:'dumbbell',  title:'运动',   btnLabel:'练完了'},
  {templateId:'stretch',  cat:'health', glyph:'heart',     title:'拉伸',   btnLabel:'拉完了'},
  {templateId:'meditate', cat:'health', glyph:'lotus',     title:'冥想',   btnLabel:'完成了'},
  // 生活
  {templateId:'slack',    cat:'life',   glyph:'fish',      title:'摸鱼',   btnLabel:'摸完了'},
  {templateId:'break',    cat:'life',   glyph:'cup',       title:'休息',   btnLabel:'休息好了'},
  {templateId:'commute',  cat:'life',   glyph:'train',     title:'通勤',   btnLabel:'到了'},
  {templateId:'errand',   cat:'life',   glyph:'cart',      title:'买菜',   btnLabel:'买完了'},
  {templateId:'message',  cat:'life',   glyph:'chat',      title:'消息',   btnLabel:'回完了'},
  {templateId:'nap',      cat:'life',   glyph:'moon',      title:'午睡',   btnLabel:'睡醒了'},
  {templateId:'chores',   cat:'life',   glyph:'broom',     title:'家务',   btnLabel:'做完了'},
  {templateId:'shower',   cat:'life',   glyph:'shower',    title:'洗澡',   btnLabel:'洗好了'},
  // 其他
  {templateId:'hobby',    cat:'other',  glyph:'music',     title:'爱好',   btnLabel:'玩够了'},
  {templateId:'todo',     cat:'other',  glyph:'pin',       title:'杂事',   btnLabel:'办完了'},
];

// 睡前清单：通用版 / 个人版
export const NIGHT_ITEMS = [
  {id:'np',label:'手机充电'},{id:'nb',label:'明天的包收拾好'},{id:'na',label:'定好闹钟'},
];
export const PERSONAL_NIGHT = [
  {id:'nl',label:'💻 电脑装包'},{id:'nc',label:'🔌 充电器装包'},
  {id:'ne',label:'🎧 耳机装包'},{id:'nw',label:'💧 水杯装包'},{id:'ng',label:'👕 运动服装包'},
];

export const SAMPLE_JOBS = [
  {title:'Software Engineer',company:'示例公司 A · 旧金山',url:'#'},
  {title:'Frontend Developer',company:'示例公司 B · 远程',url:'#'},
  {title:'Product Designer',company:'示例公司 C · 纽约',url:'#'},
];
