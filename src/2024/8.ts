import Solver from '../common/base'
import { Tup } from '../utils/type'

type Point = Tup<number>

export default class D8 extends Solver {
  constructor() {
    super(2024, 8)
  }

  buildAntennaGrid(input = this.getInput()) {
    return input.reduce<{
      grid: string[][]
      antennas: { [antenna: string]: Point[] }
    }>(
      (acc, line, y) => {
        return line.split('').reduce<{
          grid: string[][]
          antennas: { [antenna: string]: Point[] }
        }>(({ grid, antennas }, char, x) => {
          if (!grid[x]) {
            grid[x] = []
          }
          grid[x][y] = char

          if (char !== '.') {
            antennas[char] = [...(antennas[char] ?? []), [x, y]]
          }

          return {
            grid,
            antennas,
          }
        }, acc)
      },
      { grid: [], antennas: {} },
    )
  }

  calcDiff([x1, y1]: Point, [x2, y2]: Point) {
    return [x2 - x1, y2 - y1]
  }

  partOne(): string | number {
    const { grid, antennas } = this.buildAntennaGrid()

    const antinodes = new Map<number, Set<number>>()

    const addAntinodes = (points: Point[]) => {
      for (const [x, y] of points) {
        if (grid[x]?.[y]) {
          if (!antinodes.has(x)) {
            antinodes.set(x, new Set())
          }

          antinodes.get(x)?.add(y)
        }
      }
    }

    const getAllNodes = (
      [x, y]: Point,
      [dx, dy]: Point,
      points: Point[] = [],
    ): Point[] => {
      if (!grid[x]?.[y]) {
        return points
      }

      return getAllNodes([x + dx, y + dy], [dx, dy], [...points, [x, y]])
    }

    for (const key of Object.keys(antennas)) {
      for (const point of antennas[key]) {
        for (const other of antennas[key]) {
          const [dx, dy] = this.calcDiff(point, other)

          if (dx === dy && dx === 0) {
            continue
          }

          const [px, py] = point
          const [ox, oy] = other

          const nodes = [
            [ox + dx, oy + dy],
            [px - dx, py - dy],
          ]

          addAntinodes(nodes as Point[])
        }
      }
    }

    let total = 0

    for (const [x] of antinodes) {
      total += antinodes.get(x)?.size ?? 0
    }

    return total
  }
  partTwo(): string | number {
    const { grid, antennas } = this.buildAntennaGrid()

    const antinodes = new Map<number, Set<number>>()

    const addAntinodes = (points: Point[]) => {
      for (const [x, y] of points) {
        if (grid[x]?.[y]) {
          if (!antinodes.has(x)) {
            antinodes.set(x, new Set())
          }

          antinodes.get(x)?.add(y)
        }
      }
    }

    const getAllNodes = (
      [x, y]: Point,
      [dx, dy]: Point,
      points: Point[] = [],
    ): Point[] => {
      if (!grid[x]?.[y]) {
        return points
      }

      return getAllNodes([x + dx, y + dy], [dx, dy], [...points, [x, y]])
    }

    for (const key of Object.keys(antennas)) {
      for (const point of antennas[key]) {
        for (const other of antennas[key]) {
          const [dx, dy] = this.calcDiff(point, other)

          if (dx === dy && dx === 0) {
            continue
          }

          const nodes = [
            ...getAllNodes(other, [dx, dy]),
            ...getAllNodes(point, [dx * -1, dy * -1]),
          ]

          addAntinodes(nodes)
        }
      }
    }

    let total = 0

    for (const [x] of antinodes) {
      total += antinodes.get(x)?.size ?? 0
    }

    return total
  }
}
