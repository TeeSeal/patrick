const SpreadSheet = require('../spreadsheet/SpreadSheet')
const moment = require('moment')
const LectureParser = require('./LectureParser')
const { todayAt, getWeekParity } = require('../../util')

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const schedules = new Map()

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
    const times = this.dayIndexes[day]
    if (!times) return 'invalid_weekday'
    const { from, to } = times

    const colIndex = this.groupIndexes[group]
    if (!colIndex) return 'invalid_group'

    const cells = this.rows
      .slice(from, to)
      .map(row => row.cells[colIndex].value)

    return LectureParser.parseLectures(cells)
  }

  lectureAt(group, time) {
    if (!time) time = moment()
    const lectures = this.lecturesFor(group, time.format('dddd').toLowerCase())
    if (lectures instanceof String) return lectures

    const parity = getWeekParity(time)
    const mapped = lectures.map(l => l[parity])

    return mapped.find(({ start, end }) => {
      const startTime = todayAt(start)
      const endTime = todayAt(end)

      return time >= startTime && time <= endTime
    })
  }

  nextLectureFor(group, time) {
    if (!time) time = moment()
    const lectures = this.lecturesFor(group, time.format('dddd').toLowerCase())
    if (lectures instanceof String) return lectures

    const parity = getWeekParity(time)
    const mapped = lectures.map(l => l[parity])

    return mapped.find(({ start }) => {
      const startTime = todayAt(start)
      return time < startTime
    })
  }

  static async fetch(path) {
    if (!isNaN(path)) path = `./assets/schedules/year${path}.xlsx`
    if (schedules.has(path)) return schedules.get(path)

    const instance = new Schedule(path).init()
    schedules.set(path, instance)
    return instance
  }
}

module.exports = Schedule
