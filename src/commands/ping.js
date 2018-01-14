const Command = require('../struct/framework/Command')

class PingCommand extends Command {
  constructor(client) {
    super(client, {
      id: 'ping',
      aliases: ['Ping']
    })
  }

  async exec(payload, chat) {
    chat.say({
      text: 'What do you need help with?',
      buttons: [{ type: 'postback', title: 'test', payload: 'TEST' }]
    })
  }
}

module.exports = PingCommand
