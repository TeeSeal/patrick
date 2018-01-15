const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const db = { Sequelize }

const sequelize = new Sequelize({
  dialect: process.env.DIALECT || 'sqlite',
  host: process.env.HOST || 'localhost',
  storage: './database.sqlite',
  operatorsAliases: Sequelize.Op,
})

fs.readdirSync(path.join(__dirname, 'models')).forEach(file => {
  const model = sequelize.import(path.join(__dirname, 'models', file))
  db[model.name] = model
})

db.sequelize = sequelize
module.exports = db
