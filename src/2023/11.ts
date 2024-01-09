import Solver from '../common/base'

class Grid {
  points: string[][]

  constructor(points: string[][]) {
    this.points = points
  }

  get rows() {
    return this.points
  }

  get numRows() {
    return this.rows.length
  }

  get columns() {
    const cols = []

    for (const [c] of this.points[0].entries()) {
      cols.push(this.rows.map((r) => r[c]))
    }

    return cols
  }

  get numColumns() {
    return this.points[0].length
  }

  addRow(r: number, value: string, after = true) {
    this.points.splice(after ? r + 1 : r, 0, Array(this.numColumns).fill(value))
  }

  addColumn(c: number, value: string, after = true) {
    for (const row of this.points) {
      row.splice(after ? c + 1 : c, 0, value)
    }
  }

  findAll(value: string) {
    const points = [] as number[][]
    for (let r = 0; r < this.rows.length; r++) {
      for (let c = 0; c < this.rows[r].length; c++) {
        if (this.rows[r][c] === value) {
          points.push([r, c])
        }
      }
    }

    return points
  }

  updateValue([r, c]: number[], value: string | number) {
    this.points[r][c] = String(value)
  }

  shortestPath(a: number[], b: number[]) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
  }

  print() {
    console.log('\n')
    console.log(this.points.map((r) => r.join('')).join('\n'))
  }
}

class GridV2 extends Grid {
  expandedRows: number[] = []
  expandedCols: number[] = []
  expansionMod: number

  constructor(points: string[][], expansionMod: number) {
    super(points)
    this.expansionMod = expansionMod
  }

  addRow(r: number, value: string, after?: boolean): void {
    this.expandedRows.push(r)
  }

  addColumn(c: number, value: string, after?: boolean): void {
    this.expandedCols.push(c)
  }

  shortestPath([ar, ac]: number[], [br, bc]: number[]): number {
    const adjustRow = (r: number) => {
      const numExpanded = this.expandedRows.filter((ex) => ex < r).length
      const expansionOffset = numExpanded * this.expansionMod - numExpanded
      return r + expansionOffset
    }

    const adjustCol = (c: number) => {
      const numExpanded = this.expandedCols.filter((ex) => ex < c).length
      const expansionOffset = numExpanded * this.expansionMod - numExpanded
      return c + expansionOffset
    }

    const a = [adjustRow(ar), adjustCol(ac)]
    const b = [adjustRow(br), adjustCol(bc)]

    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
  }
}

export default class D11 extends Solver {
  constructor() {
    super(2023, 11)
  }

  parseGalaxyMap(input = this.getInput()) {
    return new Grid(input.map((r) => r.split('')))
  }

  expandRowsAndCols(grid: Grid) {
    const rowsToExpand = grid.rows.reduce((toExpand, row, r) => {
      return row.every((v) => v === '.') ? [...toExpand, r] : toExpand
    }, [] as number[])

    for (const [i, r] of rowsToExpand.entries()) {
      grid.addRow(r + i, '.')
    }

    const colsToExpand = grid.columns.reduce((toExpand, col, c) => {
      return col.every((v) => v === '.') ? [...toExpand, c] : toExpand
    }, [] as number[])

    for (const [i, c] of colsToExpand.entries()) {
      grid.addColumn(c + i, '.')
    }
  }

  expandRowsAndColsV2(grid: Grid) {
    const rowsToExpand = grid.rows.reduce((toExpand, row, r) => {
      return row.every((v) => v === '.') ? [...toExpand, r] : toExpand
    }, [] as number[])

    for (const [i, r] of rowsToExpand.entries()) {
      grid.addRow(r, '.')
    }

    const colsToExpand = grid.columns.reduce((toExpand, col, c) => {
      return col.every((v) => v === '.') ? [...toExpand, c] : toExpand
    }, [] as number[])

    for (const [i, c] of colsToExpand.entries()) {
      grid.addColumn(c, '.')
    }
  }

  partOne(): string | number {
    const grid = this.parseGalaxyMap(this.getTestInput())

    this.expandRowsAndCols(grid)

    const galaxies = grid.findAll('#')

    const pairs = []

    for (const [i, g] of galaxies.entries()) {
      grid.updateValue(g, i + 1)

      for (let j = i + 1; j < galaxies.length; j++) {
        pairs.push([i, j])
      }
    }

    return pairs.reduce((totalDistance, [g1, g2]) => {
      return totalDistance + grid.shortestPath(galaxies[g1], galaxies[g2])
    }, 0)
  }

  partTwo(): string | number {
    const grid = new GridV2(
      this.getInput().map((r) => r.split('')),
      1000000,
    )
    this.expandRowsAndColsV2(grid)
    const galaxies = grid.findAll('#')

    const pairs = []

    for (const [i, g] of galaxies.entries()) {
      for (let j = i + 1; j < galaxies.length; j++) {
        pairs.push([i, j])
      }
    }

    return pairs.reduce((totalDistance, [g1, g2]) => {
      return totalDistance + grid.shortestPath(galaxies[g1], galaxies[g2])
    }, 0)
  }
}
