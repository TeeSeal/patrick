const Command = require('../struct/framework/Command')
const Schedule = require('../struct/schedule/Schedule')
const chrono = require('chrono-node')
const moment = require('moment')
const { User } = require('../db')
const { parseYear } = require('../util')

class AtCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'at',
      aliases: [/\bnow\b|\bat\b/i],
    })
  }

  async exec(payload, chat) {
    const user = await User.findById(payload.sender.id)
    const match = payload.message.text.match(/\w{1,4}-\d{3}/)
    const group = (match && match[0]) || (user && user.group)

    if (!group) {
      return chat.say(
        'I don\'t know what group you\'re from. Please type "intro".'
      )
    }

    let parsed = chrono.parseDate(payload.message.text)
    const year = parseYear(group)
    if (year < 1 || year > 4) {
      return chat.say('That group doesn\'t exist.')
    }

    const schdl = await Schedule.fetch(year)
    const time = parsed ? moment(parsed) : moment()
    const lecture = schdl.lectureAt(group, time)

    if (lecture === 'invalid_weekday') {
      return chat.say('Not a valid weekday.')
    }

    if (lecture === 'invalid_group') {
      return match
        ? chat.say('Couldn\'t find that group.')
        : chat.say('Couldn\'t find your group. Try doing "intro" again.')
    }

    if (!lecture) {
      return parsed && !payload.message.text.includes('now')
        ? chat.say('You don\'t have a lecture at that time.')
        : chat.say('You don\'t have a lecture now.')
    }

    return chat.say(
      `${lecture.start} - ${lecture.end} | ${lecture.name} with ${
        lecture.prof
      } in ${lecture.room}`
    )
  }
}

module.exports = AtCommand
