class Lecture {
  constructor(instances, times) {
    if (!Array.isArray(instances)) instances = [instances]

    this.info = instances[0]
    this.odd = this.info
    this.even = instances[1] ? instances[1] : this.info
    this.changesWeekly = instances.length === 2
    this.start = times.start
    this.end = times.end
  }
}

module.exports = Lecture
