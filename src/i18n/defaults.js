// 内置任务、插入事件、清单条目的中英文
// 按 id 查；文字还是默认值（中文或英文版本）时才跟着语言切换，用户改过的保持原样
// 一个字段可以有几种默认写法（数组），比如通用版和个人版的按钮文字不同
// example：休息时"写下第一步"输入框里的灰色例子

const T = (zh, en) => ({ zh, en });

export const DEFAULT_TEXT = {
  // 每日任务（通用版 + 个人版）
  breakfast: { title:T('早餐','Breakfast'), hint:T('酸奶在冰箱 · 麦片在桌上','Yogurt in the fridge · cereal on the table'), btnLabel:T('吃完了','Ate it'),
               example:T('把碗和杯子拿出来','Take out a bowl and a cup') },
  leave:     { title:T('出门','Head out'), hint:T('全部打勾才能出门','Check everything before you go'),
               btnLabel:[T('背包确认 · 出门','Bag ready · go'), T('出门了','Out the door')],
               example:T('把钥匙放进口袋','Put your keys in your pocket') },
  work:      { title:T('工作','Work'), btnLabel:T('工作完成','Work done'), example:T('打开要做的那个文件','Open the file you need') },
  lunch:     { title:T('午餐','Lunch'), btnLabel:T('吃完了','Ate it'), example:T('把饭盒拿出来','Take out your lunch') },
  study:     { title:T('学习','Study'), btnLabel:T('学完了','Done studying'), example:T('把书翻到上次那页','Open the book where you left off') },
  gym:       { title:[T('健身','Workout'), T('运动','Exercise')], hint:T('运动服在包里','Gym clothes are in the bag'), btnLabel:T('练完了','Done'),
               example:T('换上运动服','Put on your workout clothes') },
  dinner:    { title:T('晚饭','Dinner'), btnLabel:T('吃完了','Ate it'), example:T('把锅放到灶上','Put the pan on the stove') },
  relax:     { title:T('放松','Unwind'), btnLabel:T('今天完成 🎉','Day done 🎉'), example:T('把手机放远一点','Put your phone out of reach') },
  jobs:      { title:T('今日求职','Job search'), btnLabel:T('已查阅','Checked'), example:T('打开求职网站','Open the job board') },
  supps:     { title:T('补剂','Supplements'), btnLabel:T('今天完成 🎉','Day done 🎉'), example:T('把药盒拿出来','Take out the pill box') },

  // 插入事件（插入后 id 是 meeting_3 这种，查的时候去掉后缀）
  cook:     { title:T('做饭','Cook'),        btnLabel:T('做好了','Ready'),      example:T('把菜从冰箱拿出来','Take the veggies out of the fridge') },
  snack:    { title:T('加餐','Snack'),       btnLabel:T('吃完了','Ate it'),     example:T('洗一个水果','Wash a piece of fruit') },
  water:    { title:T('喝水','Drink water'), btnLabel:T('喝了','Done'),         example:T('倒一杯水','Pour a glass of water') },
  meeting:  { title:T('会议','Meeting'),     btnLabel:T('开完了','Done'),       example:T('打开会议链接','Open the meeting link') },
  call:     { title:T('电话','Call'),        btnLabel:T('打完了','Done'),       example:T('找到要打的号码','Find the number') },
  read:     { title:T('阅读','Read'),        btnLabel:T('看完了','Done'),       example:T('把书拿在手里','Pick up the book') },
  write:    { title:T('写作','Write'),       btnLabel:T('写完了','Done'),       example:T('打开空白文档写一句话','Open a blank page and write one line') },
  email:    { title:T('回邮件','Email'),     btnLabel:T('回完了','Done'),       example:T('打开收件箱第一封','Open the first email') },
  review:   { title:T('复习','Review'),      btnLabel:T('复习完了','Done'),     example:T('翻开笔记','Open your notes') },
  walk:     { title:T('散步','Walk'),        btnLabel:T('走完了','Done'),       example:T('穿上鞋','Put on your shoes') },
  exercise: { title:T('运动','Exercise'),    btnLabel:T('练完了','Done'),       example:T('换上运动服','Put on your workout clothes') },
  stretch:  { title:T('拉伸','Stretch'),     btnLabel:T('拉完了','Done'),       example:T('铺开瑜伽垫','Roll out the mat') },
  meditate: { title:T('冥想','Meditate'),    btnLabel:T('完成了','Done'),       example:T('找个地方坐下','Find a spot and sit down') },
  slack:    { title:T('摸鱼','Goof off'),    btnLabel:T('摸完了','Done'),       example:T('定个 10 分钟闹钟','Set a 10-minute timer') },
  break:    { title:T('休息','Break'),       btnLabel:T('休息好了','Rested'),   example:T('站起来走两步','Stand up and walk a little') },
  commute:  { title:T('通勤','Commute'),     btnLabel:T('到了','Arrived'),      example:T('戴上耳机','Put on your headphones') },
  errand:   { title:T('买菜','Groceries'),   btnLabel:T('买完了','Got them'),   example:T('列好购物清单','Write the shopping list') },
  message:  { title:T('消息','Messages'),    btnLabel:T('回完了','Replied'),    example:T('打开聊天软件','Open your messages') },
  nap:      { title:T('午睡','Nap'),         btnLabel:T('睡醒了','Awake'),      example:T('定个 20 分钟闹钟','Set a 20-minute alarm') },
  chores:   { title:T('家务','Chores'),      btnLabel:T('做完了','Done'),       example:T('先收拾一个桌面','Clear one surface first') },
  shower:   { title:T('洗澡','Shower'),      btnLabel:T('洗好了','Done'),       example:T('拿好换洗衣服','Grab clean clothes') },
  hobby:    { title:T('爱好','Hobby'),       btnLabel:T('玩够了','Done'),       example:T('把要用的东西拿出来','Get your things out') },
  todo:     { title:T('杂事','Odds & ends'), btnLabel:T('办完了','Done'),       example:T('写下最小的那一件','Write down the smallest one') },

  // 出门清单（个人版）
  cl: { label:T('💻 电脑','Laptop') },
  cc: { label:T('🔌 充电器','Charger') },
  ce: { label:T('🎧 耳机','Headphones') },
  cw: { label:T('💧 水杯','Water bottle') },
  cg: { label:T('👕 运动服（已装）','Gym clothes (packed)') },

  // 睡前清单（通用版 + 个人版）
  np: { label:T('手机充电','Charge your phone') },
  nb: { label:T('明天的包收拾好','Pack tomorrow’s bag') },
  na: { label:T('定好闹钟','Set an alarm') },
  nl: { label:T('💻 电脑装包','Laptop packed') },
  nc: { label:T('🔌 充电器装包','Charger packed') },
  ne: { label:T('🎧 耳机装包','Headphones packed') },
  nw: { label:T('💧 水杯装包','Water bottle packed') },
  ng: { label:T('👕 运动服装包','Gym clothes packed') },
};
