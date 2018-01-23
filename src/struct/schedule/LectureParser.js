const ROOM_REGEXP = /(\d{3}|3--?3|USMF)/g
const PROF_REGEXP = /[A-Z]\. ?[^\d\s]+/g

const Lecture = require('./Lecture')
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

class LectureParser {
  static parseLectures(cells) {
    const lectures = paginate(cells, 6)
    let longFlag = false
    return lectures
      .map((lecture, index) => {
        const textLines = lecture.filter(c => c)
        if (!textLines.length) return null
        const roomCells = textLines.filter(text => ROOM_REGEXP.test(text))

        let data
        const first3 = lecture.slice(0, 3)
        const last3 = lecture.slice(3, 6)
        const firstRoomCells = first3.filter(text => ROOM_REGEXP.test(text))
        const lastRommCells = last3.filter(text => ROOM_REGEXP.test(text))

        const isWeekly =
          textLines.length == 6 ||
          (first3.every(l => l) && firstRoomCells.length === 1) ||
          (last3.every(l => l) && lastRommCells.length === 1)

        const isLong = roomCells.length === 0
        if (longFlag) {
          data = LectureParser.parseLongLecture(lectures[index - 1], lecture)
          longFlag = false
        } else if (isWeekly) {
          data = LectureParser.parseWeeklyLecture(textLines)
        } else if (isLong) {
          data = LectureParser.parseLongLecture(lecture, lectures[index + 1])
          longFlag = true
        } else {
          data = LectureParser.parseLecture(lecture)
        }

        return new Lecture(data, timeTable[index])
      })
      .filter(l => l)
  }

  static parseLecture(lines) {
    const nameLines = []
    const profRoomLines = lines.filter(line => {
      if (!line) return false
      line = line.toString()
      if (line.match(ROOM_REGEXP) || line.match(PROF_REGEXP)) return true
      nameLines.push(line)
      return false
    })

    const prof = profRoomLines
      .join(' ')
      .match(PROF_REGEXP)
      .join(' / ')

    const room = profRoomLines
      .join(' ')
      .match(ROOM_REGEXP)
      .join(' / ')

    return {
      name: nameLines
        .map(l => l.trim())
        .join(' ')
        .replace(/;/, ' /'),
      prof,
      room,
    }
  }

  static parseLongLecture(l1, l2) {
    return LectureParser.parseLecture(l1.concat(l2).filter(c => c))
  }

  static parseWeeklyLecture(cells) {
    const [n1, p1, c1, n2, p2, c2] = cells
    const l1 = n1 ? LectureParser.parseLecture([n1, p1, c1]) : null
    const l2 = n2 ? LectureParser.parseLecture([n2, p2, c2]) : null
    return [l1, l2]
  }
}

module.exports = LectureParser
