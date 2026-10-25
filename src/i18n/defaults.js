// 默认任务、调板模板、清单条目的中英文
// 按 id 查；文字还是默认值（中文或英文版本）时才跟着语言切换，用户改过的保持原样

const T = (zh, en) => ({ zh, en });

export const DEFAULT_TEXT = {
  // 每日任务
  breakfast: { title:T('早餐','Breakfast'), hint:T('酸奶在冰箱 · 麦片在桌上','Yogurt in the fridge · cereal on the table'), btnLabel:T('吃完了','Ate it') },
  leave:     { title:T('出门','Head out'), hint:T('全部打勾才能出门','Check everything before you go'), btnLabel:T('背包确认 · 出门','Bag ready · go') },
  study:     { title:T('学习','Study'), btnLabel:T('学完了','Done studying') },
  lunch:     { title:T('午餐','Lunch'), btnLabel:T('吃完了','Ate it') },
  jobs:      { title:T('今日求职','Job search'), btnLabel:T('已查阅','Checked') },
  work:      { title:T('工作','Work'), btnLabel:T('工作完成','Work done') },
  gym:       { title:T('健身','Workout'), hint:T('运动服在包里','Gym clothes are in the bag'), btnLabel:T('练完了','Done') },
  dinner:    { title:T('晚饭','Dinner'), btnLabel:T('吃完了','Ate it') },
  supps:     { title:T('补剂','Supplements'), btnLabel:T('今天完成 🎉','Day done 🎉') },

  // 调板模板（插入后 id 是 meeting_3 这种，查的时候去掉后缀）
  meeting:  { title:T('会议','Meeting'),   btnLabel:T('开完了','Done') },
  call:     { title:T('电话','Call'),      btnLabel:T('打完了','Done') },
  slack:    { title:T('摸鱼','Goof off'),  btnLabel:T('摸完了','Done') },
  break:    { title:T('休息','Break'),     btnLabel:T('休息好了','Rested') },
  commute:  { title:T('通勤','Commute'),   btnLabel:T('到了','Arrived') },
  errand:   { title:T('买菜','Groceries'), btnLabel:T('买完了','Got them') },
  message:  { title:T('消息','Messages'),  btnLabel:T('回完了','Replied') },
  nap:      { title:T('午睡','Nap'),       btnLabel:T('睡醒了','Awake') },
  meditate: { title:T('冥想','Meditate'),  btnLabel:T('完成了','Done') },
  read:     { title:T('阅读','Read'),      btnLabel:T('看完了','Done') },

  // 出门清单
  cl: { label:T('💻 电脑','Laptop') },
  cc: { label:T('🔌 充电器','Charger') },
  ce: { label:T('🎧 耳机','Headphones') },
  cw: { label:T('💧 水杯','Water bottle') },
  cg: { label:T('👕 运动服（已装）','Gym clothes (packed)') },

  // 睡前清单
  nl: { label:T('💻 电脑装包','Laptop packed') },
  nc: { label:T('🔌 充电器装包','Charger packed') },
  ne: { label:T('🎧 耳机装包','Headphones packed') },
  nw: { label:T('💧 水杯装包','Water bottle packed') },
  ng: { label:T('👕 运动服装包','Gym clothes packed') },
};
