const Chat = require('./Chat')

class Postback {
  constructor(client, opts) {
    this.client = client
    Object.assign(this, opts)

    client.on(`postback:${this.id}`, (payload, chat, data) => {
      this.exec(payload, new Chat(chat), data)
    })
  }

  exec() {}
}

module.exports = Postback
