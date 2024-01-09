import Solver from '../common/base'

type Basin = Map<number, Set<number>>

class D9 extends Solver {
  constructor() {
    super(2021, 9)
  }

  buildHeightMap(input: string[] = this.getTestInput()) {
    return input.map((r) => r.split('').map(Number))
  }

  genAdjPoints(r: number, c: number): [number, number][] {
    return [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]
  }

  findLowPoints(heightMap: number[][]): [number, number][] {
    const lowPoints: [number, number][] = []
    const isLowPoint = ([r, c]: number[], height: number) => {
      const adjHeight = heightMap[r]?.[c]

      return adjHeight === undefined ? true : adjHeight > height
    }

    for (const r of heightMap.keys()) {
      for (const c of heightMap[r].keys()) {
        const height = heightMap[r][c]
        const isLow = this.genAdjPoints(r, c).every((adjPoint) =>
          isLowPoint(adjPoint, height),
        )

        if (isLow) {
          lowPoints.push([r, c])
        }
      }
    }

    return lowPoints
  }

  genBasin(
    heightMap: number[][],
    [r, c]: [number, number],
    basin: Basin = new Map<number, Set<number>>(),
  ): Basin {
    // Point already in basin
    // Point out of bounds
    // Point is basin boundry
    if (
      basin.get(r)?.has(c) ||
      heightMap[r]?.[c] === undefined ||
      heightMap[r]?.[c] === 9
    ) {
      return basin
    }

    if (!basin.has(r)) {
      basin.set(r, new Set<number>())
    }

    basin.get(r)?.add(c)

    for (const adjPoint of this.genAdjPoints(r, c)) {
      basin = this.genBasin(heightMap, adjPoint, basin)
    }

    return basin
  }

  partOne(): string | number {
    const heightMap = this.buildHeightMap(this.getInput())

    const lowPoints = this.findLowPoints(heightMap)

    return lowPoints
      .map(([r, c]) => heightMap[r][c] + 1)
      .reduce((a, b) => a + b)
  }

  partTwo(): string | number {
    const heightMap = this.buildHeightMap(this.getInput())
    const lowPoints = this.findLowPoints(heightMap)

    const calcBasinSize = (basin: Basin) => {
      let size = 0

      for (const cols of basin.values()) {
        size += cols.size
      }

      return size
    }

    const basinSizes = lowPoints
      .map((lowPoint) => {
        return calcBasinSize(this.genBasin(heightMap, lowPoint))
      })
      .sort((a, b) => b - a)

    return basinSizes.slice(0, 3).reduce((acc, size) => acc * size, 1)
  }
}

export default D9
