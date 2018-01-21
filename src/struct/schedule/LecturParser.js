const ROOM_REGEXP = /^(\d+|3--?3|[A-Z]{4})$/


class LecureParser {
    static parseLectures(cells) {
        const lectures = paginate(cells, 6)
        return lectures
            .map((lecture, index) => {
                const textLines = lecture.filter(c => c)
                if (!textLines.length) return null
                const roomCells = textLines.filter(text => ROOM_REGEXP.test(text))

                let data

                if (roomCells.length == 2 && textLines.length == 6) {
                    data = LectureParser.parseWeeklyLecture(textLines)
                }

                return new Lecture(data, timeTable[index])
            })
            .filter(l => l)
    }

    static parseLongLecture(l1, l2) {
        const [name, prof, cab] = l1.concat(l2).filter(c => c)
        return { name, prof, cab: Number(cab) }
    }

    static parseWeeklyLecture(cells) {
        const [n1, p1, c1, n2, p2, c2] = cells
        return [
            { name: n1, prof: p1, cab: Number(c1) },
            { name: n2, prof: p2, cab: Number(c2) },
        ]
    }
}

module.exports = LectureParser
