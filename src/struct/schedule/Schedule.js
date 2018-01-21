const SpreadSheet = require('../spreadsheet/SpreadSheet')
const moment = require('moment')
const LectureParser = require('./LectureParser')

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

class Schedule extends SpreadSheet {
  constructor(path) {
    super(path)

    this.groupRowIndex = 0
    this.groupIndexes = {}

    this.dayIndexes = {}
  }

  async init() {
    await super.init()
    this.assignGroups()
    this.assignDayIndexes()
    return this
  }

  assignGroups() {
    const values = this.rows
      .find(row => /Grupele/i.test(row.cells[1].value))
      .cells.map(c => c.value)

    for (const [idx, value] of values.entries()) {
      if (/[A-Z]{1,4}-\d{3}/.test(value)) this.groupIndexes[value] = idx
    }
  }

  assignDayIndexes(column = 2) {
    const values = this.column(column).cells.map(c => c.value)
    const days = values.filter(
      (val, idx) =>
        val &&
        values.filter(v => v === val).length > 24 &&
        idx === values.indexOf(val)
    )
    if (days.length !== 5) throw new Error('coldn\'t parse 5 days in schedule.')

    for (const [idx, day] of days.entries()) {
      this.dayIndexes[WEEKDAYS[idx]] = {
        from: values.indexOf(day),
        to: values.lastIndexOf(day),
      }
    }
  }

  get groupRow() {
    return this.sheet._rows[this.groupRowIndex]
  }

  lecturesFor(group, day) {
    const { from, to } = this.dayIndexes[day]
    if (!from) return null

    const colIndex = this.groupIndexes[group]

    const cells = this.rows
      .slice(from, to)
      .map(row => row.cells[colIndex].value)

    return LectureParser.parseLectures(cells)
  }

  currentLectureFor(group, time) {
    const currentTime = time || moment()
    const lectures = this.lecturesFor(
      group,
      currentTime.formad('dddd').toLowerCase()
    )

    if (!lectures) return null

    return lectures.find(({ start, end }) => {
      const startTime = Schedule.todayAt(start)
      const endTime = Schedule.todayAt(end)

      return currentTime > startTime && currentTime < endTime
    })
  }

  nextLectureFor(group, time) {
    const currentTime = time || moment()
    const lectures = this.lecturesFor(
      group,
      currentTime.format('dddd').toLowerCase()
    )

    if (!lectures) return null

    return lectures.find(({ start }) => {
      const startTime = Schedule.todayAt(start)
      return currentTime < startTime
    })
  }

  static todayAt(time) {
    return moment(
      moment().startOf('day') + moment.duration(time).asMilliseconds()
    )
  }
}

module.exports = Schedule
