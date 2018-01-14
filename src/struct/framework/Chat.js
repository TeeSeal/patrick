const BootChat = require('../../../node_modules/bootbot/lib/Chat')

class Chat extends BootChat {
  constructor(chat) {
    super(chat.bot, chat.userId)
  }

  awaitMessage(time = 3e4) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('time'), time)

      const listener = payload => {
        if (this.userId && payload.sender.id !== this.userId) return

        this.bot.removeListener('message', listener)
        return resolve(payload.message.text)
      }

      this.bot.on('message', listener)
    })
  }
}

module.exports = Chat
