const BootChat = require('../../../node_modules/bootbot/lib/Chat')

class Chat extends BootChat {
  constructor(chat) {
    super(chat.bot, chat.userId)
  }

  awaitMessage(time = 6e4) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('time'), time)

      this.bot.once('message', (payload, ...args) => {
        if (this.userId && payload.sender.id !== this.userId) return
        return resolve({ content: payload.message.text, payload, ...args })
      })
    })
  }

  buttonConfirm(text, buttons, time = 6e4) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('time'), time)

      this.say({
        text,
        buttons: buttons.map(btn => {
          return {
            type: 'postback',
            title: btn,
            payload: btn,
          }
        }),
      }).then(() => {
        this.bot.once('postback', ({ postback }) => resolve(postback.payload))
      })
    })
  }

  ask(question, opts) {
    const { fallback, retries, parse, validate, confirm } = {
      fallback: 'Couldn\'t get that. Come again?',
      confirm: 'Please confirm.',
      retries: 3,
      validate: () => true,
      parse: res => res,
      ...opts,
    }

    return new Promise(async (resolve, reject) => {
      let msg

      for (let i = 0; i < retries; i++) {
        try {
          msg = await this.prompt(question)
        } catch (err) {
          return reject('NO_RESPONSE')
        }

        let res = msg.content
        if (res && validate(res)) {
          res = parse(res)

          if (Array.isArray(res)) {
            res = await this.prompt({
              text: confirm,
              quickReplies: res.map(thing => thing.toString()),
            }).then(({ content }) => content)
          }

          return resolve({ ...msg, res })
        }
        await this.say(fallback)
      }
    })
  }

  prompt(question) {
    return this.say(question).then(() => this.awaitMessage())
  }
}

module.exports = Chat
