const Chat = require('./Chat')

class Command {
  constructor(client, opts) {
    this.client = client
    Object.assign(this, opts)

    client.hear(this.aliases || this.id, (payload, chat, data) => {
      this.exec(payload, new Chat(chat), data)
    })
  }

  exec() {}
}

module.exports = Command
