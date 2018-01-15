require('dotenv').config()
const Client = require('./struct/framework/Client')
const { sequelize } = require('./db')

sequelize.sync({ force: true }).then(() => {
  new Client(
    {
      accessToken: process.env.ACCESS_TOKEN,
      verifyToken: process.env.VERIFY_TOKEN,
      appSecret: process.env.APP_SECRET,
    },
    {
      commandDir: './src/commands',
      postbackDir: './src/postbacks',
    }
  ).start()
})
