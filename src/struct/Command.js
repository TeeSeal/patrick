class Command {
  constructor(client, opts) {
    Object.assign(this, opts)

    client.module(c => {
      c.hear(this.aliases || this.id, (...args) => this.exec(...args))
    })
  }

  exec() {}
}

module.exports = Command
