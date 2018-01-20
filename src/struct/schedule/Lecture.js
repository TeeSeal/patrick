class Lecture {
  constructor(instances) {
    if (!Array.isArray(instances)) instances = [instances]

    this.info = instances[0]
    this.odd = this.info
    this.even = instances[1] ? instances[1] : this.info
    this.changesWeekly = instances.length === 2
  }
}

module.exports = Lecture
