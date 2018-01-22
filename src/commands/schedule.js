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
      aliases: [/lecture|course|lesson|pair/],
    })
  }

  async exec(payload, chat) {
    if (/now$|next$/.test(payload.message.text)) return
    const user = await User.findById(payload.sender.id)
    const group = payload.message.text.match(/\w{1,4}-\d{3}/)[0] || user.group
    if (!group) {
      return chat.say(
        'I don\'t know what group you\'re from. Please type "intro".'
      )
    }

    const parsed = chrono.parseDate(payload.message.text)
    if (!parsed) return chat.say('Sorry, couldn\'t get that.')

    const year = parseYear(group)
    const schdl = await new Schedule(
      `./assets/schedules/year${year}.xlsx`
    ).init()

    const time = moment(parsed)
    const parity = getWeekParity(time)
    const lectures = schdl
      .lecturesFor(group, time.format('dddd').toLowerCase())
      .map(l => l[parity])
      .filter(l => l)

    for (const lecture of lectures) {
      await chat.say(
        `${lecture.start} - ${lecture.end} | ${lecture.name} with ${
          lecture.prof
        } in ${lecture.room}`
      )
    }
  }
}

module.exports = ScheduleCommand
