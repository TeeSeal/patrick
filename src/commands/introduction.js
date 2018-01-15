const Command = require('../struct/framework/Command')
const { User } = require('../db')

class IntroCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'intro',
      aliases: ['intro', 'introduction'],
    })
  }

  async exec(payload, chat) {
    const { res: firstName } = await chat.ask('What is your first name?', {
      fallback: 'Just your first name please.',
      validate(response) {
        return response.split(' ').length === 1
      },
    })
    const { res: lastName } = await chat.ask('Okay, what is your last name?', {
      fallback: 'Just your last name please.',
      validate(response) {
        return response.split(' ').length === 1
      },
    })

    const { res: age } = await chat.ask('Very well. How old are you?', {
      fallback: 'Please tell me a number.',
      validate(response) {
        return /\d/.test(response)
      },
      parse(response) {
        const matches = response.match(/\d+/g).map(Number)
        if (matches.length === 1) return matches[0]
        return matches
      },
    })

    const { res: group } = await chat.ask(
      'Alright. And finally, in what group are you currently?',
      {
        validate(response) {
          return /\w{2,3}-\d{3}/.test(response.toUpperCase())
        },
        parse(response) {
          return response.match(/\w{2,3}-\d{3}/)[0].toUpperCase()
        },
      }
    )

    chat.say('Okay, all written down!')
    User.create({ firstName, lastName, age, group })
  }
}

module.exports = IntroCommand
