require('dotenv').config()
const Client = require('./struct/framework/Client')

const client = new Client(
  {
    accessToken: process.env.ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
  },
  {
    commandDir: './src/commands',
    postbackDir: './src/postbacks'
  }
)

client.start()
