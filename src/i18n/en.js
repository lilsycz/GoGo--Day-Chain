// English UI text   → Swift: Localizable.xcstrings (en)
export default {
  // Common
  'close': 'Close', 'cancel': 'Cancel', 'ok': 'OK', 'save': 'Save', 'undo': 'Undo',
  'done.default': 'Done',

  // Top bar / menu
  'aria.calendar': 'Calendar', 'aria.today': "Today's log", 'aria.menu': 'Menu',
  'greet': 'Your {part}',
  'part.night': 'night', 'part.morning': 'morning', 'part.noon': 'midday', 'part.afternoon': 'afternoon', 'part.evening': 'evening',
  'weekdays': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
  'menu.insert': 'Add something', 'menu.edit': 'Edit tasks', 'menu.bedtime': 'Bedtime',
  'menu.dark': 'Dark mode', 'menu.light': 'Light mode', 'menu.lang': '中文', 'menu.reset': 'Reset today',
  'reset.title': 'Reset today?', 'reset.body': "Today's progress, anything you added for today, and today's log will be cleared.", 'reset.ok': 'Reset',
  'aria.edit': 'Edit tasks', 'edit.title': 'Edit', 'edit.hint': 'Tap text to rename · hold ≡ to reorder · drag new events in from below',
  'menu.export': 'Export data', 'menu.import': 'Import data',
  'export.done': 'Backup exported', 'import.title': 'Import backup?', 'import.body': 'Your tasks, log and settings on this device will be replaced with the ones in the backup.', 'import.ok': 'Import', 'import.bad': 'This file isn’t a GoGo backup',
  'toast.insertedAfter': '“{t}” added after “{after}”', 'toast.insertedFirst': '“{t}” added at the top',
  'field.hint': 'Note', 'field.step': 'First step', 'aria.style': 'Color and icon',
  'edit.today': 'Today', 'tpl.saveAs': 'Save as template', 'tpl.switch': 'Templates', 'tpl.newPh': 'New template name', 'tpl.overwrote': 'Saved to “{n}”',
  'tpl.label': 'Templates', 'tpl.generic': 'Basic', 'tpl.personal': 'Personal', 'tpl.save': '＋ Save as template',
  'tpl.saveTitle': 'Save as template', 'tpl.namePh': 'e.g. Weekday, Sunday', 'tpl.saved': 'Saved template “{n}”',
  'tpl.switchTitle': 'Switch to “{n}”?', 'tpl.switchBody': 'What you’ve done today stays; the rest is replaced with this template. Every day will start from it.',
  'tpl.switchOk': 'Switch', 'tpl.switched': 'Switched to “{n}”',
  'tpl.delTitle': 'Delete template “{n}”?', 'tpl.delBody': 'Only the template is deleted; today’s tasks stay as they are.', 'tpl.delOk': 'Delete',
  'step.example': 'e.g. Get out what you need', 'rest.writeStep': 'Write the smallest first step',
  'edit.bar': 'Editing · tap text to change, drag ≡ to reorder', 'edit.done': 'Done',

  // Palette / new event
  'pal.title': 'Add something', 'pal.hint': 'Tap to add after the current task, or hold and drag it anywhere above · today only', 'pal.custom': 'Your own', 'pal.new': '＋ New event',
  'cm.title': 'New event', 'cm.icon': 'Icon', 'cm.name': 'Name', 'cm.name.ph': 'Event name',
  'cm.step': 'First step (optional)', 'cm.step.ph': 'e.g. Take the guitar out',
  'cm.cat': 'Category (sets the color)', 'cm.btn': 'Button text when done', 'cm.btn.ph': 'Done',
  'cm.note': 'Saved on this device. No sign-in needed.', 'cm.save': 'Save',

  // Bedtime
  'bed.kicker': 'Bedtime', 'bed.title': 'Get ready for tomorrow', 'bed.sub': 'Pack tonight, just head out tomorrow',
  'bed.bag': 'Bag check', 'bed.first': "Tomorrow's first thing", 'bed.study': 'Study', 'bed.work': 'Work',
  'bed.study.ph': 'Open course X, continue lesson N…', 'bed.work.ph': 'Open X, keep working on Y…',
  'bed.save': 'See you tomorrow', 'bed.today': 'Today', 'bed.tomorrow': 'Tomorrow', 'bed.night': 'Before bed', 'bed.firstUp': 'First up', 'bed.add': '＋ Add one', 'bed.editTomorrow': 'Edit tomorrow', 'menu.title': 'Settings', 'menu.log': 'Past days', 'log.step': 'First step', 'log.note': 'Note', 'log.none': 'Nothing yet. Finish a task and it shows up here.', 'aria.bedtime': 'Bedtime', 'bed.back': '← Back to today',

  // Chain
  'step': 'First step', 'step.bedtime': 'First step · from last night', 'step.ghost': 'Write the smallest first step',
  'step.ph': 'e.g. Put the pan on the stove', 'step.edit.ph': 'Tap to write the smallest first step…', 'hint.edit.ph': 'Tap to add a note…',
  'start.kicker': 'A new day', 'start.title': 'Start right away,<br>GOGO', 'start.first': 'First up',
  'start.btn': 'Start today', 'start.insert': 'Add one first',
  'skipped': 'Skipped', 'restore': 'Restore', 'remove': 'Remove', 'drag': 'Drag to reorder',
  'act.swap': 'Swap', 'act.insert': 'Add one', 'act.undo': 'Undo last',
  'once': 'Today only', 'once.add': 'Add to every day',
  'fold.done': '✓ {n} done', 'fold.skip': ' · {n} skipped', 'next': 'Up next',
  'fold.all': 'Show all ▾', 'fold.less': 'Show less ▴',
  'alldone': 'All done today.', 'alldone.log': "See today's log →", 'alldone.add': '＋ Add one more',
  'toast.removed': 'Removed “{t}”', 'toast.removedDaily': 'Removed “{t}” from every day', 'toast.daily': 'This will show up every day now',

  // Rest
  'min': '{n} min', 'hour1': '1 hour',
  'rest.done': 'Done.', 'rest.again': 'OK, rest a bit more',
  'rest.ask': 'Remind you in…', 'rest.askAgain': 'Remind you again in…',
  'rest.noRemind': "Don't remind me", 'rest.skip': 'No break, start the next one',
  'rest.willRemind': "I'll nudge you at {time}", 'rest.change': 'Change', 'rest.wontRemind': 'No reminder set', 'rest.setRemind': 'Set one',
  'rest.title': 'Resting', 'rest.sub': 'No rush. Rest until you feel like going on.', 'rest.ready': "I'm ready, start",
  'rest.firstStep': 'First step: {s}',
  'due.kicker': 'Time to start · {t}', 'due.step': 'Now you could:<br>{s}', 'due.task': 'Now you could start<br>“{t}”',
  'due.now': 'Start now', 'due.later': 'Later',
  'notify.title': 'Time to start', 'notify.step': 'Now you could: {s}', 'notify.task': 'Now you could start “{t}”',

  // Swap
  'swap.title': 'Swap', 'swap.sub': 'Not up for “{t}” right now? That’s okay.', 'swap.pick': 'Do this first',
  'swap.later': 'Move it to the end', 'swap.skip': 'Skip “{t}” today', 'swap.cancel': 'Never mind',

  // Log / calendar
  'cal.kicker': 'Calendar', 'log.kicker': 'Log',
  'log.ongoing': 'now', 'log.unfinished': 'unfinished', 'log.count': 'done', 'log.rest': 'Rest',
  'log.back': '← Calendar', 'log.today': 'Today · ', 'log.started': '{time} started the day',
  'log.notStarted': 'You haven’t started today.<br>Once you tap “Start today”, everything gets logged here.',
  'log.empty': 'Nothing logged this day.',
  'cal.prev': 'Previous month', 'cal.next': 'Next month', 'cal.week': 'M,T,W,T,F,S,S', 'cal.month': '{name}',

  // Durations
  'dur.min': '{m} min', 'dur.h': '{h} h', 'dur.hm': '{h} h {m} min',

  // Categories
  'cat.meal': 'Meals', 'cat.focus': 'Focus', 'cat.health': 'Health', 'cat.life': 'Life', 'cat.other': 'Other',

  // Jobs
  'jobs.connect': 'Connect a GitHub Action →', 'jobs.set': 'Set JSON URL', 'jobs.prompt': 'Job feed JSON URL',
  'jobs.co1': 'Example Co. A · San Francisco', 'jobs.co2': 'Example Co. B · Remote', 'jobs.co3': 'Example Co. C · New York',
};
