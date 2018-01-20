class Column {
  constructor(sheet, opts) {
    this.sheet = sheet
    this.number = opts.number
    this.name = opts.name
    this.cells = []
  }

  addCell(cell) {
    this.cells.push(cell)
  }
}

module.exports = Column
