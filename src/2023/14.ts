import Solver from '../common/base'

type Point = [number, number]
type Direction = 'N' | 'E' | 'S' | 'W'

class Platform {
  grid: string[][]

  constructor(grid: string[][]) {
    this.grid = grid
  }

  shift([r, c]: Point, direction: Direction) {
    const [r2, c2] = (() => {
      switch (direction) {
        case 'N':
          return [r - 1, c]
        case 'E':
          return [r, c + 1]
        case 'S':
          return [r + 1, c]
        case 'W':
          return [r, c - 1]
      }
    })()
    const point = this.grid[r][c]
    const pointAbove = this.grid[r2]?.[c2]

    if (point === 'O' && pointAbove === '.') {
      this.grid[r2][c2] = point
      this.grid[r][c] = '.'

      this.shift([r2, c2], direction)
    }
  }

  cycle(direction: Direction) {
    if (direction === 'N') {
      for (const [r, row] of this.grid.entries()) {
        for (const [c] of row.entries()) {
          this.shift([r, c], direction)
        }
      }
    }

    if (direction === 'E') {
      const numCols = this.grid[0].length - 1
      for (const c in this.grid[0]) {
        for (const r in this.grid) {
          this.shift([Number(r), numCols - Number(c)], direction)
        }
      }
    }

    if (direction === 'S') {
      const numRows = this.grid.length - 1
      for (const [r, row] of this.grid.entries()) {
        for (const [c] of row.entries()) {
          this.shift([numRows - r, c], direction)
        }
      }
    }

    if (direction === 'W') {
      for (const c in this.grid[0]) {
        for (const r in this.grid) {
          this.shift([Number(r), Number(c)], direction)
        }
      }
    }

    if (direction === 'N') {
      for (const [r, row] of this.grid.entries()) {
        for (const [c] of row.entries()) {
          this.shift([r, c], direction)
        }
      }
    }
  }

  spin(cycles: number): string[] {
    let cycle = 0

    const cycleHistory = []

    while (cycle < cycles) {
      this.cycle('N')
      this.cycle('W')
      this.cycle('S')
      this.cycle('E')

      cycleHistory.push(this.minify())

      cycle++
    }

    return cycleHistory
  }

  minify() {
    return this.grid.map((row) => row.join('')).join('')
  }

  expand(history: string[]) {
    const rowSize = this.grid[0].length
    let i = 0

    const grid = []

    while (history.length > 0) {
      grid.push(history.splice(0, rowSize))
    }

    return grid
  }

  calcLoad() {
    return this.grid.reduce((totalLoad, row, r) => {
      const rowLoad = this.grid.length - r
      return row.reduce((rowTotalLoad, cell) => {
        return rowTotalLoad + (cell === 'O' ? rowLoad : 0)
      }, totalLoad)
    }, 0)
  }

  print() {
    console.log('\n')
    for (const r of this.grid) {
      console.log(r.join(''))
    }
  }
}

export default class D14 extends Solver {
  constructor() {
    super(2023, 14)
  }

  genPlatform(input = this.getInput()) {
    return new Platform(input.map((r) => r.split('')))
  }

  partOne(): string | number {
    const platform = this.genPlatform()

    platform.cycle('N')

    const totalLoad = platform.calcLoad()

    return totalLoad
  }

  partTwo(): string | number {
    const platform = this.genPlatform()

    platform.spin(2000)

    return platform.calcLoad()
  }
}
