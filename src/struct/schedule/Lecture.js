class Lecture {
  constructor(instances, times) {
    if (!Array.isArray(instances)) instances = [instances]

    instances = instances.map(instance => {
      if (!instance) return null
      instance.start = times.start
      instance.end = times.end
      return instance
    })

    this.info = instances.find(i => i)
    this.odd = this.info
    this.even = instances[1] ? instances[1] : this.info
    this.changesWeekly = instances.length === 2
  }
}

module.exports = Lecture
