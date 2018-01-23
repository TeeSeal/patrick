const Command = require('../struct/framework/Command')
const Schedule = require('../struct/schedule/Schedule')
const chrono = require('chrono-node')
const moment = require('moment')
const { User } = require('../db')
const { getWeekParity, parseYear } = require('../util')

class ScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'schedule',
      aliases: [/lecture|course|lesson|pair|have/],
    })
  }

  async exec(payload, chat) {
    if (/now$|next$/.test(payload.message.text)) return

    const user = await User.findById(payload.sender.id)
    const match = payload.message.text.match(/\w{1,4}-\d{3}/)
    const group = (match && match[0]) || (user && user.group)

    if (!group) {
      return chat.say(
        'I don\'t know what group you\'re from. Please type "intro".'
      )
    }

    const parsed = chrono.parseDate(payload.message.text)
    if (!parsed) return chat.say('Sorry, couldn\'t get that.')

    const year = parseYear(group)

    if (year < 1 || year > 4) {
      return chat.say('That group doesn\'t exist.')
    }

    const schdl = await Schedule.fetch(year)
    const time = moment(parsed)
    const lectures = schdl.lecturesFor(group, time.format('dddd').toLowerCase())

    if (lectures === 'invalid_weekday') {
      return chat.say('That is not a valid weekday.')
    }

    if (lectures === 'invalid_group') {
      return match
        ? chat.say('Couldn\'t find that group.')
        : chat.say('Couldn\'t find your group. Try doing "intro" again.')
    }

    const transformed = lectures.map(l => l[getWeekParity(time)]).filter(l => l)

    for (const lecture of transformed) {
      await chat.say(
        `${lecture.start} - ${lecture.end} | ${lecture.name} with ${
          lecture.prof
        } in ${lecture.room}`
      )
    }
  }
}

module.exports = ScheduleCommand
