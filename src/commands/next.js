const Command = require('../struct/framework/Command')
const Schedule = require('../struct/schedule/Schedule')
const { User } = require('../db')
const { parseYear } = require('../util')

class NextCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'next',
      aliases: [/\bnext\b$/i],
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

    const year = parseYear(group)
    if (year < 1 || year > 4) {
      return chat.say('That group doesn\'t exist.')
    }

    const schdl = await Schedule.fetch(year)
    const lecture = schdl.nextLectureFor(group)

    if (lecture === 'invalid_weekday') {
      return chat.say('Not a valid weekday.')
    }

    if (lecture === 'invalid_group') {
      return match
        ? chat.say('Couldn\'t find that group.')
        : chat.say('Couldn\'t find your group. Try doing "intro" again.')
    }

    if (!lecture) {
      return chat.say('You have no more lectures today.')
    }

    return chat.say(
      `${lecture.start} - ${lecture.end} | ${lecture.name} with ${
        lecture.prof
      } in ${lecture.room}`
    )
  }
}

module.exports = NextCommand
