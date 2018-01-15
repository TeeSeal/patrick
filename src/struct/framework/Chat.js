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

  ask(question, opts) {
    const { fallback, retries, parse, validate } = {
      fallback: 'Couldn\'t get that. Come again?',
      retries: 3,
      validate: () => true,
      parse: res => res,
      ...opts,
    }

    return new Promise(async (resolve, reject) => {
      let res

      for (let i = 0; i < retries; i++) {
        try {
          res = await this.prompt(question)
        } catch (err) {
          return reject('NO_RESPONSE')
        }

        if (res && validate(res)) return resolve(parse(res))
        await this.say(fallback)
      }
    })
  }

  prompt(question) {
    return this.say(question).then(() => this.awaitMessage())
  }
}

module.exports = Chat
