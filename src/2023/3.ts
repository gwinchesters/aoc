import { generateSeries } from '../utils/series'
import Solver from '../common/base'

interface PartType {
  partNum: number
  row: number
  start: number
  end: number
}

const Part = (num: string, row: number, colStart: number): PartType => {
  return {
    partNum: Number(num),
    row,
    start: colStart,
    end: colStart + num.length - 1,
  }
}

export default class D3 extends Solver {
  constructor() {
    super(2023, 3)
  }

  parseSchematic(input = this.getTestInput()) {
    const schematicMap: string[][] = []
    const parts = input.reduce<PartType[]>((parts, line, row) => {
      schematicMap.push(line.split(''))
      return [
        ...parts,
        ...[...line.matchAll(/\d+/g)].map((m) => {
          return Part(m[0], row, m.index ?? -1)
        }),
      ]
    }, [])

    return {
      parts,
      schematicMap,
    }
  }

  getAdjacentPoints({ row, start, end }: PartType) {
    return [
      [row, start - 1],
      [row - 1, start - 1],
      [row + 1, start - 1],
      [row, end + 1],
      [row - 1, end + 1],
      [row + 1, end + 1],
      ...generateSeries(start, end).reduce<[number, number][]>((points, n) => {
        return [...points, [row - 1, n], [row + 1, n]]
      }, []),
    ]
  }

  isPart(schematicMap: string[][], part: PartType) {
    return this.getAdjacentPoints(part).some(([r, c]) => {
      return schematicMap[r]?.[c] && /[^\.0-9]/.test(schematicMap[r]?.[c])
    })
  }

  findAdjGearPos(schematicMap: string[][], part: PartType) {
    return this.getAdjacentPoints(part).find(([r, c]) => {
      return schematicMap[r]?.[c] === '*'
    })
  }

  partOne(): string | number {
    const { parts, schematicMap } = this.parseSchematic(this.getInput())

    return parts.reduce(
      (partNumSum, p) =>
        this.isPart(schematicMap, p) ? partNumSum + p.partNum : partNumSum,
      0,
    )
  }

  partTwo(): string | number {
    const { parts, schematicMap } = this.parseSchematic(this.getInput())

    const gearMap = parts.reduce((gm, p) => {
      const gearPos = this.findAdjGearPos(schematicMap, p)

      if (gearPos) {
        const [r, c] = gearPos

        if (!gm[r]) {
          gm[r] = {}
        }

        if (!gm[r][c]) {
          gm[r][c] = []
        }

        gm[r][c].push(p.partNum)
      }

      return gm
    }, {} as { [r: number]: { [c: number]: number[] } })

    return Object.values(gearMap).reduce((ratioTotal, colMap) => {
      return Object.values(colMap).reduce((rt, adjParts) => {
        if (adjParts.length === 2) {
          return rt + adjParts[0] * adjParts[1]
        }
        return rt
      }, ratioTotal)
    }, 0)
  }
}
