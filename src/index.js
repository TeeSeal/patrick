require('dotenv').config()
const Client = require('./struct/Client')

const client = new Client(
  {
    accessToken: process.env.ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    appSecret: process.env.APP_SECRET
  },
  {
    commandDir: './src/commands'
  }
)

client.start()
