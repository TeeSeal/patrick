require('dotenv').config()
const BootBot = require('bootbot')

const client = new BootBot({
  accessToken: process.env.ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET
})

client.hear(['hello', 'hi', 'hey'], (payload, chat) => {
  chat.say('Hello there!')
})

client.start()
