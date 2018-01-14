const Command = require('../struct/framework/Command')

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'ping',
      aliases: ['Ping']
    })
  }

  async exec(payload, chat) {
    const age = await chat.ask('How old are you?', {
      validate(response) {
        return !isNaN(response)
      },
      parse: Number
    })

    chat.say(`So you are ${age} years old.`)
  }
}

module.exports = PingCommand
