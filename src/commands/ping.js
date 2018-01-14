const Command = require('../struct/Command')

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'ping',
      aliases: ['Ping']
    })
  }

  exec(payload, chat) {
    chat.say('pong!')
  }
}

module.exports = PingCommand
