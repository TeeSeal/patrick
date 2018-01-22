const moment = require('moment')

const startsOfYear = {
  y2017: moment('2017-09-04'),
}

class Util {
  static parseYear(group) {
    const num = Number(group.match(/\d+/)[0].slice(0, 2))
    return Util.getAcademicYear() % 100 - num + 1
  }

  static getAcademicYear(time = moment()) {
    time = moment(time)
    return time.subtract(8, 'months').year()
  }

  static getWeekParity(time = moment()) {
    time = moment(time)
    const startOfYear = startsOfYear[`y${Util.getAcademicYear()}`]
    const dif = moment(time - startOfYear)
    const weeks = dif.week()

    return weeks % 2 ? 'odd' : 'even'
  }
}

module.exports = Util
