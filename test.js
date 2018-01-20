const Schedule = require('./src/struct/schedule/Schedule')
const moment = require('moment')

async function run() {
  const schdl = await new Schedule('./assets/schedules/orar.xlsx').init()
  console.log(schdl.nextLectureFor('IA-162', moment('2018-01-15 07:00')))
}

run()
