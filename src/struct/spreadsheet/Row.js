class Row {
  constructor(sheet, opts) {
    this.sheet = sheet
    this.number = opts.number
    this.cells = []
  }

  addCell(cell) {
    this.cells.push(cell)
  }
}

module.exports = Row
