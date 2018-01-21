const Schedule = require('./src/struct/schedule/Schedule')
const moment = require('moment')

async function run() {
  const schdl = await new Schedule('./assets/schedules/orar.xlsx').init()
  console.log(schdl.lecturesFor('ISBM-161', 'thursday').map(l => l.info.name))
}

run()

// const parser = require('./src/struct/schedule/LectureParser')
// const lines = [
//   '1. lab. POO',
//   '2. lab. MMC',
//   'M.Kulev',
//   '110',
//   'V. Ţurcanu',
//   '114',
// ]
// console.log(parser.parseLecture(lines))
