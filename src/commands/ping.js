const Command = require('../struct/framework/Command')

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'ping',
      aliases: ['Ping'],
    })
  }

  async exec(payload, chat) {
    const { res: age } = await chat.ask('How old are you?', {
      validate(response) {
        return /\d/.test(response)
      },
      parse(response) {
        const matches = response.match(/\d+/g).map(Number)
        if (matches.length === 1) return matches[0]
        return matches
      },
    })

    chat.say(`So you are ${age} years old.`)
  }
}

module.exports = PingCommand
