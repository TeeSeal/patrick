const SpreadSheet = require('../spreadsheet/SpreadSheet')
const Lecture = require('./Lecture')
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const timeTable = [
  {
    from : '8:00',
    to: '9:30'
  },
  {
    from : '9:45',
    to: '11:15'
  },
  {
    from : '11:30',
    to: '13:00'
  },
  {
    from : '13:30',
    to: '15:00'
  },
  {
    from : '15:15',
    to: '16:45'
  },
  {
    from : '17:00',
    to: '18:30'
  },
  {
    from : '18:40',
    to: '20:15'
  }
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
      if (/[A-Z]{1,3}-\d{3}/.test(value)) this.groupIndexes[value] = idx
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

        if (textLines.length === 1) {
          return this.parseLongLecture(lectures[index - 1], lecture)
        }
        if (textLines.length === 2) {
          return this.parseLongLecture(lecture, lectures[index + 1])
        }
        if (textLines.length === 6) {
          return this.parseWeeklyLecture(lecture)
        }

        const [name, prof, cab] = textLines
        return new Lecture({ name, prof, cab: Number(cab) })
      })
      .filter(l => l)
  }

  parseLongLecture(l1, l2) {
    const [name, prof, cab] = l1.concat(l2).filter(c => c)
    return new Lecture({ name, prof, cab: Number(cab) })
  }

  parseWeeklyLecture(cells) {
    const [n1, p1, c1, n2, p2, c2] = cells
    return new Lecture([
      { name: n1, prof: p1, cab: Number(c1) },
      { name: n2, prof: p2, cab: Number(c2) },
    ])
  }
}

module.exports = Schedule
