const Postback = require('../struct/framework/Postback')

class TestPostback extends Postback {
  constructor(client) {
    super(client, {
      id: 'TEST'
    })
  }

  exec(payload, chat) {
    chat.say('ok')
  }
}

module.exports = TestPostback
