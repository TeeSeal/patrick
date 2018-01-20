const Schedule = require('./src/struct/schedule/Schedule')

async function run() {
  const schdl = await new Schedule('./assets/schedules/orar.xlsx').init()
  console.log(schdl.lecturesFor('FAF-161', 'wednesday')[0].odd)
}

run()
