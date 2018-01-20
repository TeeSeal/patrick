const SpreadSheet = require('../spreadsheet/SpreadSheet')
const Lecture = require('./Lecture')
const moment = require('moment')

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const timeTable = [
  {
    start: '8:00',
    end: '9:30',
  },
  {
    start: '9:45',
    end: '11:15',
  },
  {
    start: '11:30',
    end: '13:00',
  },
  {
    start: '13:30',
    end: '15:00',
  },
  {
    start: '15:15',
    end: '16:45',
  },
  {
    start: '17:00',
    end: '18:30',
  },
  {
    start: '18:40',
    end: '20:15',
  },
]

function paginate(arr, count) {
  return arr
    .map((item, index) => {
      if (index % count !== 0) return null
      return arr.slice(index, index + count)
    })
    .filter(page => page)
}

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

    return this.parseLectures(cells)
  }

  parseLectures(cells) {
    const lectures = paginate(cells, 6)
    return lectures
      .map((lecture, index) => {
        const textLines = lecture.filter(c => c)
        if (!textLines.length) return null
        let data

        if (textLines.length === 1) {
          data = this.parseLongLecture(lectures[index - 1], lecture)
        } else if (textLines.length === 2) {
          data = this.parseLongLecture(lecture, lectures[index + 1])
        } else if (textLines.length === 6) {
          data = this.parseWeeklyLecture(lecture)
        } else {
          const [name, prof, cab] = textLines
          data = { name, prof, cab: Number(cab) }
        }

        return new Lecture(data, timeTable[index])
      })
      .filter(l => l)
  }

  parseLongLecture(l1, l2) {
    const [name, prof, cab] = l1.concat(l2).filter(c => c)
    return { name, prof, cab: Number(cab) }
  }

  parseWeeklyLecture(cells) {
    const [n1, p1, c1, n2, p2, c2] = cells
    return [
      { name: n1, prof: p1, cab: Number(c1) },
      { name: n2, prof: p2, cab: Number(c2) },
    ]
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
