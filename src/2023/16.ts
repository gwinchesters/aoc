import { generateSeries } from '../utils/series'
import Solver from '../common/base'

type Pos = [number, number]

// Direction of travel
type DOT = 'N' | 'E' | 'S' | 'W'
type TileType = '.' | '\\' | '/' | '|' | '-'

class Beam {
  pos: Pos
  dot: DOT

  constructor(pos: Pos, dot: DOT) {
    this.pos = pos
    this.dot = dot
  }

  getNextPos() {
    const [r, c] = this.pos
    switch (this.dot) {
      case 'N':
        return [r - 1, c]
      case 'E':
        return [r, c + 1]
      case 'S':
        return [r + 1, c]
      case 'W':
        return [r, c - 1]
    }
  }
}

class Tile {
  pos: Pos
  type: TileType
  seenBeams: DOT[]

  constructor(pos: Pos, type: TileType) {
    this.pos = pos
    this.type = type
    this.seenBeams = []
  }

  isEnergized() {
    return this.seenBeams.length > 0
  }

  simBeam({ dot }: Beam): Beam[] {
    if (this.seenBeams.includes(dot)) {
      return []
    }

    this.seenBeams.push(dot)

    if (this.type === '.') {
      return [new Beam(this.pos, dot)]
    }

    if (this.type === '/' || this.type === '\\') {
      return [new Beam(this.pos, this.getReflection(dot))]
    }

    return this.getSplits(dot).map((splitDot) => new Beam(this.pos, splitDot))
  }

  getReflection(dot: DOT): DOT {
    switch (dot) {
      case 'N':
        return this.type === '/' ? 'E' : 'W'
      case 'E':
        return this.type === '/' ? 'N' : 'S'
      case 'S':
        return this.type === '/' ? 'W' : 'E'
      case 'W':
        return this.type === '/' ? 'S' : 'N'
    }
  }

  getSplits(dot: DOT): DOT[] {
    switch (dot) {
      case 'N':
      case 'S':
        return this.type === '-' ? ['E', 'W'] : [dot]
      case 'E':
      case 'W':
        return this.type === '-' ? [dot] : ['N', 'S']
      default:
        return []
    }
  }

  print(onlyEmpty = true) {
    if (this.isEnergized()) {
      if (this.type === '.' || !onlyEmpty) {
        return '#'
      }
    }

    return this.type
  }

  reset() {
    this.seenBeams = []
  }
}

class LightSim {
  tiles: Tile[][]
  beams: Beam[]

  constructor(tiles: Tile[][]) {
    this.tiles = tiles
    this.beams = []
  }

  simulate(beam = new Beam([0, 0], 'E')) {
    const [r, c] = beam.pos
    const startTile = this.tiles[r][c]
    this.beams = [...startTile.simBeam(beam)]

    while (this.beams.length > 0) {
      const beam = this.beams.splice(0, 1)[0]
      const [nr, nc] = beam.getNextPos()
      const nextTile = this.tiles[nr]?.[nc]

      // Beam traveled off grid
      if (!nextTile) {
        continue
      }

      const newBeams = nextTile.simBeam(beam)

      this.beams = [...this.beams, ...newBeams]
    }
  }

  reset() {
    for (const row of this.tiles) {
      for (const t of row) {
        t.reset()
      }
    }
  }

  countEnergizedTiles(reset = false) {
    const count = this.tiles.reduce((count, row) => {
      return row.reduce((c, t) => {
        return c + (t.isEnergized() ? 1 : 0)
      }, count)
    }, 0)

    if (reset) {
      this.reset()
    }

    return count
  }

  print() {
    for (const row of this.tiles) {
      console.log(row.map((t) => t.print()).join(''))
    }
  }
}

export default class D16 extends Solver {
  constructor() {
    super(2023, 16)
  }

  parseTiles(input = this.getInput()) {
    return input.map((row, r) => {
      return row.split('').map((t, c) => {
        return new Tile([r, c], t as TileType)
      })
    })
  }

  partOne(): string | number {
    const tiles = this.parseTiles()
    const sim = new LightSim(tiles)

    sim.simulate()

    return sim.countEnergizedTiles()
  }

  partTwo(): string | number {
    const tiles = this.parseTiles()
    const sim = new LightSim(tiles)

    const numRows = tiles.length
    const numColumns = tiles[0].length

    const possibleCounts = [
      // First Column
      ...generateSeries(0, numRows - 1).map((r) => new Beam([r, 0], 'E')),
      // Last Column
      ...generateSeries(0, numRows - 1).map(
        (r) => new Beam([r, numColumns - 1], 'W'),
      ),
      // First Row
      ...generateSeries(0, numColumns - 1).map((c) => new Beam([0, c], 'S')),
      // Last Row
      ...generateSeries(0, numColumns - 1).map(
        (c) => new Beam([numRows - 1, c], 'N'),
      ),
    ].map((b) => {
      sim.simulate(b)
      return sim.countEnergizedTiles(true)
    })

    return Math.max(...possibleCounts)
  }
}
