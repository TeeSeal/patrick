const BootBot = require('bootbot')
const fs = require('fs')
const path = require('path')
const Collection = require('./Collection')

class Client extends BootBot {
  constructor(keys, { commandDir, postbackDir, convoDir }) {
    super(keys)

    this.commandDir = commandDir
    this.postbackDir = postbackDir
    this.convoDir = convoDir

    this.commands = new Collection()
    this.postbacks = new Collection()
    this.convos = new Collection()

    this.init()
  }

  init() {
    const arr = [
      [this.commandDir, this.commands],
      [this.postbackDir, this.loadPostbacks],
      [this.convoDir, this.convos]
    ]

    for (const [dir, coll] of arr) {
      if (dir) this.loadModules(dir, coll)
    }
  }

  loadModules(dir, collection) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const Constructor = require(path.join(
        path.relative(__dirname, dir),
        file
      ))
      const instance = new Constructor(this)
      collection.set(instance.id, instance)
    }
  }
}

module.exports = Client
