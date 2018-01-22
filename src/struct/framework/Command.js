const Chat = require('./Chat')
const owners = process.env.OWNER_ID.split(';')

class Command {
  constructor(client, opts) {
    this.client = client
    Object.assign(this, opts)

    client.hear(this.aliases || this.id, (payload, chat, data) => {
      if (this.ownerOnly && !owners.includes(payload.sender.id)) return
      this.exec(payload, new Chat(chat), data)
    })
  }

  exec() {}
}

module.exports = Command
