import { generateSeries } from '../utils/series'
import Solver from '../common/base'

type Pattern = string[][]
type Point = [number, number]

export default class D13 extends Solver {
  constructor() {
    super(2023, 13)
  }

  parsePatterns(input = this.getInput()) {
    const patterns: Pattern[] = []
    let pattern: Pattern = []
    for (const line of input) {
      if (line === '') {
        patterns.push(pattern)
        pattern = [] as Pattern
        continue
      }

      pattern.push(line.split(''))
    }

    patterns.push(pattern)

    return patterns
  }

  isSymetric(pattern: Pattern, pairs: [Point, Point][]) {
    return pairs.every(
      ([[ar, ac], [br, bc]]) => pattern[ar][ac] === pattern[br][bc],
    )
  }

  getPairs(max: number, lineNum: number, knownCoor: number, isRow: boolean) {
    const pairs: [Point, Point][] = []
    let lowerOffset = lineNum - 1
    let upperOffset = lineNum

    while (lowerOffset >= 0 && upperOffset < max) {
      if (isRow) {
        pairs.push([
          [knownCoor, lowerOffset],
          [knownCoor, upperOffset],
        ])
      } else {
        pairs.push([
          [lowerOffset, knownCoor],
          [upperOffset, knownCoor],
        ])
      }

      lowerOffset -= 1
      upperOffset += 1
    }

    return pairs
  }

  checkVerticalSym(pattern: Pattern) {
    const width = pattern[0].length
    const rows = generateSeries(0, pattern.length - 1)
    const symLines = generateSeries(1, width - 1)

    return symLines.find((lineNum) => {
      return rows.every((row) =>
        this.isSymetric(pattern, this.getPairs(width, lineNum, row, true)),
      )
    })
  }

  checkHorizontalSym(pattern: Pattern) {
    const height = pattern.length
    const cols = generateSeries(0, pattern[0].length - 1)
    const symLines = generateSeries(1, height - 1)

    return symLines.find((lineNum) => {
      return cols.every((col) =>
        this.isSymetric(pattern, this.getPairs(height, lineNum, col, false)),
      )
    })
  }

  partOne(): string | number {
    const patterns = this.parsePatterns()

    return patterns.reduce((total, p, i) => {
      const vSym = this.checkVerticalSym(p)

      if (vSym) {
        return total + vSym
      }

      const hSym = this.checkHorizontalSym(p)

      if (!hSym) {
        console.log('no line of symetry for pattern: ' + i)
        return total
      }

      return total + hSym * 100
    }, 0)
  }

  countSmudges(pattern: Pattern, pairs: [Point, Point][]) {
    let smudgeCount = 0

    for (const p of pairs) {
      const [[ar, ac], [br, bc]] = p
      if (pattern[ar][ac] !== pattern[br][bc]) {
        smudgeCount++
        if (smudgeCount > 1) {
          break
        }
      }
    }

    return smudgeCount
  }

  findVerticalSymSmudge(pattern: Pattern) {
    const width = pattern[0].length
    const rows = generateSeries(0, pattern.length - 1)
    const symLines = generateSeries(1, width - 1)

    for (const lineNum of symLines) {
      const smudgeCount = rows.reduce((smudges, row) => {
        return (
          smudges +
          this.countSmudges(pattern, this.getPairs(width, lineNum, row, true))
        )
      }, 0)

      if (smudgeCount === 1) {
        return lineNum
      }
    }

    return null
  }

  findHorizontalSymSmudge(pattern: Pattern) {
    const height = pattern.length
    const cols = generateSeries(0, pattern[0].length - 1)
    const symLines = generateSeries(1, height - 1)

    for (const lineNum of symLines) {
      const smudgeCount = cols.reduce((smudges, col) => {
        return (
          smudges +
          this.countSmudges(pattern, this.getPairs(height, lineNum, col, false))
        )
      }, 0)

      if (smudgeCount === 1) {
        return lineNum
      }
    }

    return null
  }

  partTwo(): string | number {
    const patterns = this.parsePatterns()

    return patterns.reduce((total, p, i) => {
      const vSym = this.findVerticalSymSmudge(p)

      if (vSym) {
        return total + vSym
      }

      const hSym = this.findHorizontalSymSmudge(p)

      if (!hSym) {
        console.log('no line of symetry for pattern: ' + i)
        return total
      }

      return total + hSym * 100
    }, 0)
  }
}
