class Cell {
  constructor(row, column, opts) {
    this.row = row
    this.column = column
    this.opts = opts
    this.value = opts.value
  }
}

module.exports = Cell
