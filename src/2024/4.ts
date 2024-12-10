import { Tup } from '../utils/type'
import Solver from '../common/base'

type Point = Tup<number>
const Directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
type Direction = (typeof Directions)[number]

class WordFinder {
  grid: string[][]
  deltaMap: { [dir in Direction]: Tup<number> } = {
    N: [0, -1],
    NE: [1, -1],
    E: [1, 0],
    SE: [1, 1],
    S: [0, 1],
    SW: [-1, 1],
    W: [-1, 0],
    NW: [-1, -1],
  }

  pointsRam: Point[] = []
  usedPoints: Point[] = []

  constructor(grid: string[][]) {
    this.grid = grid
  }

  findAll(word: string, startingPoints: Point[] = []) {
    return startingPoints.reduce<number>((total, point) => {
      return Directions.reduce<number>((total, dir) => {
        if (this.traverseAndCheck(point, dir, word)) {
          return total + 1
        }

        return total
      }, total)
    }, 0)
  }

  addToRam(point: Point) {
    this.pointsRam.push(point)
  }

  resetRam(store = false) {
    if (store) {
      this.usedPoints = [...this.usedPoints, ...this.pointsRam]
    }
    this.pointsRam = []
  }

  traverseAndCheck(
    [x, y]: Point,
    direction: Direction,
    word: string,
    iteration = 0,
  ): boolean {
    if (iteration === word.length) {
      this.resetRam(true)
      return true
    }
    if (!this.grid[x]?.[y]) {
      this.resetRam()
      return false
    }

    if (this.grid[x][y] === word.charAt(iteration)) {
      this.addToRam([x, y])
      const [deltaX, deltaY] = this.deltaMap[direction]
      return this.traverseAndCheck(
        [x + deltaX, y + deltaY],
        direction,
        word,
        ++iteration,
      )
    }
    this.resetRam()
    return false
  }

  printGrid() {
    const rows: string[][] = []

    for (const x in this.grid) {
      for (const y in this.grid[x]) {
        if (!rows[y]) {
          rows[y] = []
        }

        const used = !!this.usedPoints.find(
          ([px, py]) => px === Number(x) && py === Number(y),
        )

        const val = used ? this.grid[x][y] : '.'

        rows[y].push(val)
      }
    }
    for (const row of rows) {
      console.log(row.join(''))
    }
  }
}

class D4 extends Solver {
  constructor() {
    super(2024, 4)
  }

  buildSearchGrid(input = this.getInput(), firstChar = '') {
    return input.reduce<{
      grid: string[][]
      points: Point[]
    }>(
      (acc, line, y) => {
        return line.split('').reduce<{
          grid: string[][]
          points: Point[]
        }>(({ grid, points }, char, x) => {
          if (!grid[x]) {
            grid[x] = []
          }
          grid[x][y] = char

          if (char === firstChar) {
            points.push([x, y])
          }
          return {
            grid,
            points,
          }
        }, acc)
      },
      { grid: [], points: [] },
    )
  }

  partOne(): string | number {
    const { grid, points } = this.buildSearchGrid(this.getInput(), 'X')

    const finder = new WordFinder(grid)

    const count = finder.findAll('XMAS', points)

    return count
  }

  partTwo(): string | number {
    const { grid, points } = this.buildSearchGrid(this.getInput(), 'A')

    const validXMas = ([x, y]: Point) => {
      const primary = [
        [x - 1, y - 1],
        [x, y],
        [x + 1, y + 1],
      ] as Point[]

      const secondary = [
        [x - 1, y + 1],
        [x, y],
        [x + 1, y - 1],
      ] as Point[]

      const diagReducer = (str: string, [x, y]: Point): string => {
        return str + (grid[x]?.[y] ?? '.')
      }

      const primaryStr = primary.reduce<string>(diagReducer, '')
      const secondaryStr = secondary.reduce<string>(diagReducer, '')

      return [primaryStr, secondaryStr].every((str) => /MAS|SAM/.test(str))
    }

    return points.reduce<number>(
      (total, point) => total + (validXMas(point) ? 1 : 0),
      0,
    )
  }
}

export default D4
