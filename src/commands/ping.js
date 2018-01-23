const Command = require('../struct/framework/Command')

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'ping',
      aliases: ['Ping'],
    })
  }

  async exec(payload, chat) {
    chat.say('pong')
  }
}

module.exports = PingCommand
