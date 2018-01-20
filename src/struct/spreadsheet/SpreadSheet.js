const { Workbook } = require('exceljs')
const Row = require('./Row')
const Column = require('./Column')
const Cell = require('./Cell')

class SpreadSheet {
  constructor(path) {
    this.path = path
    this.sheet = null

    this.rows = []
    this.columns = []
  }

  async init() {
    this.sheet = (await new Workbook().xlsx.readFile(this.path)).getWorksheet(1)
    this.rows = this.sheet._rows.map(row => new Row(this, row))
    this.columns = this.sheet.columns.map(col => new Column(this, col))

    for (const [ri, r] of this.sheet._rows.entries()) {
      for (const [ci, c] of r._cells.entries()) {
        const row = this.rows[ri]
        const column = this.columns[ci]
        const cell = new Cell(row, column, c)
        row.addCell(cell)
        column.addCell(cell)
      }
    }

    return this
  }

  row(num) {
    return this.rows[num - 1]
  }

  column(num) {
    return this.columns[num - 1]
  }

  cell(r, c) {
    return this.rows[r - 1].cells[c - 1]
  }

  get groupRow() {
    return this.sheet._rows[this.groupRowIndex]
  }
}

module.exports = SpreadSheet
