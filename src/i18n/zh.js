// 中文界面文字   → Swift: Localizable.xcstrings（zh-Hans）
export default {
  // 通用
  'close': '关闭', 'cancel': '取消', 'ok': '确定', 'save': '保存', 'undo': '撤销',
  'done.default': '完成',

  // 顶栏 / 菜单
  'aria.calendar': '日历', 'aria.today': '今天的记录', 'aria.menu': '菜单',
  'greet': '你的{part}',
  'part.night': '夜晚', 'part.morning': '早晨', 'part.noon': '中午', 'part.afternoon': '下午', 'part.evening': '晚上',
  'weekdays': '周日,周一,周二,周三,周四,周五,周六',
  'menu.insert': '插入一件事', 'menu.edit': '编辑任务', 'menu.bedtime': '睡前清单',
  'menu.dark': '深色模式', 'menu.light': '浅色模式', 'menu.lang': 'English', 'menu.reset': '重置今天',
  'reset.title': '重置今天？', 'reset.body': '今天的进度、临时插入的事件和今天的记录都会清除。', 'reset.ok': '重置',
  'aria.edit': '编辑任务', 'edit.title': '编辑', 'edit.hint': '点文字改名 · 按住 ≡ 排序 · 从下面拖入新事件',
  'menu.export': '导出数据', 'menu.import': '导入数据',
  'export.done': '已导出备份', 'import.title': '导入备份？', 'import.body': '会用备份里的任务、记录和设置，替换这台设备上现在的数据。', 'import.ok': '导入', 'import.bad': '这个文件不是 GoGo 的备份',
  'toast.insertedAfter': '「{t}」已插到「{after}」后面', 'toast.insertedFirst': '「{t}」已放在最前面',
  'field.hint': '描述', 'field.step': '第一步', 'aria.style': '颜色和图标',
  'edit.today': '今天', 'tpl.saveAs': '存为模版', 'tpl.switch': '换模版', 'tpl.newPh': '新模版名字', 'tpl.overwrote': '已存进「{n}」',
  'tpl.label': '模版', 'tpl.generic': '通用', 'tpl.personal': '个人', 'tpl.save': '＋ 存为模版',
  'tpl.saveTitle': '存为模版', 'tpl.namePh': '比如：周中、周日', 'tpl.saved': '已保存模版「{n}」',
  'tpl.switchTitle': '切换到「{n}」？', 'tpl.switchBody': '今天做完的会保留，还没做的换成这个模版里的。以后每天也按它开始。',
  'tpl.switchOk': '切换', 'tpl.switched': '已切换到「{n}」',
  'tpl.delTitle': '删除模版「{n}」？', 'tpl.delBody': '只删除这个模版，今天的任务不受影响。', 'tpl.delOk': '删除',
  'step.example': '比如：把要用的东西拿出来', 'rest.writeStep': '写下最小的第一步',
  'edit.bar': '编辑中 · 点文字改，拖 ≡ 排序', 'edit.done': '完成',

  // 插入调板 / 新建事件
  'pal.title': '插入一件事', 'pal.hint': '点一下加在当前这件后面，或按住拖到上面任意位置 · 只加在今天', 'pal.custom': '自定义', 'pal.new': '＋ 新建事件',
  'cm.title': '新建事件', 'cm.icon': '图标', 'cm.name': '名称', 'cm.name.ph': '事件名称',
  'cm.step': '第一步（可选）', 'cm.step.ph': '比如：把琴拿出来',
  'cm.cat': '类别（决定颜色）', 'cm.btn': '完成后的按钮文字', 'cm.btn.ph': '完成了',
  'cm.note': '自动保存在本设备，无需登录。', 'cm.save': '保存到调板',

  // 睡前
  'bed.kicker': '睡前清单', 'bed.title': '准备明天', 'bed.sub': '整理好，明天醒来直接出发',
  'bed.bag': '背包确认', 'bed.first': '明天的第一件事', 'bed.study': '学习', 'bed.work': '工作',
  'bed.study.ph': '打开 xx 课程，继续第 x 课…', 'bed.work.ph': '打开 xx，继续做 xx…',
  'bed.save': '明天见', 'bed.today': '今天', 'bed.tomorrow': '明天', 'bed.night': '睡前', 'bed.firstUp': '第一件', 'bed.back': '← 返回今日',

  // 任务链
  'step': '第一步', 'step.bedtime': '第一步 · 睡前写的', 'step.ghost': '写下最小的第一步',
  'step.ph': '比如：把锅放到灶上', 'step.edit.ph': '点击写下最小的第一步…', 'hint.edit.ph': '点击添加描述…',
  'start.kicker': '新的一天', 'start.title': '直接成为直接做，<br>GOGO', 'start.first': '先做',
  'start.btn': '开始今天', 'start.insert': '先插入一件',
  'skipped': '已跳过', 'restore': '恢复', 'remove': '移除', 'drag': '拖动排序',
  'act.swap': '换一个', 'act.insert': '插入一件', 'act.undo': '退回上一步',
  'once': '只在今天', 'once.add': '加入每日任务',
  'fold.done': '✓ 已完成 {n} 件', 'fold.skip': ' · 跳过 {n} 件', 'next': '接下来',
  'fold.all': '显示全部 ▾', 'fold.less': '收起 ▴',
  'alldone': '今天完成了。', 'alldone.log': '看看今天的记录 →', 'alldone.add': '＋ 再加一件',
  'toast.removed': '已移除「{t}」', 'toast.removedDaily': '已从每日任务移除「{t}」', 'toast.daily': '以后每天都会有这件事',

  // 休息
  'min': '{n} 分钟', 'hour1': '1 小时',
  'rest.done': '做完了。', 'rest.again': '好，再休息一会儿',
  'rest.ask': '多久后提醒你？', 'rest.askAgain': '多久后再提醒？',
  'rest.noRemind': '不用提醒', 'rest.skip': '不休息，直接开始下一件',
  'rest.willRemind': '会在 {time} 提醒你', 'rest.change': '改', 'rest.wontRemind': '不会提醒你', 'rest.setRemind': '设个提醒',
  'rest.title': '休息中', 'rest.sub': '不用急，休息到想继续为止', 'rest.ready': '我准备好了，开始',
  'rest.firstStep': '第一步：{s}',
  'due.kicker': '可以开始了 · {t}', 'due.step': '现在可以：<br>{s}', 'due.task': '现在可以开始<br>「{t}」',
  'due.now': '现在做', 'due.later': '等下做',
  'notify.title': '可以开始了', 'notify.step': '现在可以：{s}', 'notify.task': '现在可以开始「{t}」了',

  // 换一个
  'swap.title': '换一个', 'swap.sub': '现在不想「{t}」也没关系', 'swap.pick': '先做这个',
  'swap.later': '放到最后，等会儿再做', 'swap.skip': '今天跳过「{t}」', 'swap.cancel': '算了',

  // 记录 / 日历
  'cal.kicker': '日历', 'log.kicker': '记录',
  'log.ongoing': '进行中', 'log.unfinished': '未完成', 'log.count': '件', 'log.rest': '休息',
  'log.back': '← 日历', 'log.today': '今天 · ', 'log.started': '{time} 开始今天',
  'log.notStarted': '还没开始今天。<br>点"开始今天"之后，这里会自动记下每件事。',
  'log.empty': '这天没有记录。',
  'cal.prev': '上个月', 'cal.next': '下个月', 'cal.week': '一,二,三,四,五,六,日', 'cal.month': '{m}月',

  // 时长
  'dur.min': '{m} 分钟', 'dur.h': '{h} 小时', 'dur.hm': '{h} 小时 {m} 分',

  // 类别
  'cat.meal': '餐食', 'cat.focus': '专注', 'cat.health': '健康', 'cat.life': '生活', 'cat.other': '其他',

  // 求职
  'jobs.connect': '接入 GitHub Action →', 'jobs.set': '设置 JSON URL', 'jobs.prompt': '求职 JSON 地址',
  'jobs.co1': '示例公司 A · 旧金山', 'jobs.co2': '示例公司 B · 远程', 'jobs.co3': '示例公司 C · 纽约',
};
