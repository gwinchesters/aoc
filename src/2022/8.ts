import Solver from '../common/base'
import { Entries } from '../utils/type'

interface AdjTrees {
  l: number[]
  r: number[]
  t: number[]
  b: number[]
}

class TreeGrid {
  grid: number[][] = []

  constructor(gridMap: string[]) {
    this.grid = gridMap.map((r) => r.split('').map((h) => Number(h)))
  }

  get visibleCount() {
    return this.grid
      .map((row, r) => row.filter((h, c) => this.isVisible(r, c, h)).length)
      .reduce((acc, visibleTrees) => acc + visibleTrees)
  }

  get scenicScores() {
    return this.grid.reduce<number[]>((acc, row, r) => {
      return [...acc, ...row.map((h, c) => this.calcScore(r, c, h))]
    }, [])
  }

  calcScore(rI: number, c: number, h: number): number {
    if (this.isEdge(rI, c)) {
      return 0
    }

    const { l, r, t, b } = this.getAdj(rI, c)

    return (
      this.calcViewingDistance(l, h) *
      this.calcViewingDistance(r.reverse(), h) *
      this.calcViewingDistance(t, h) *
      this.calcViewingDistance(b.reverse(), h)
    )
  }

  calcViewingDistance(treeHeights: number[], height: number): number {
    const nxtTreeHeight = treeHeights.pop()

    if (nxtTreeHeight === undefined) {
      return 0
    }

    if (nxtTreeHeight >= height) {
      return 1
    }

    return 1 + this.calcViewingDistance(treeHeights, height)
  }

  isVisible(r: number, c: number, h: number) {
    return this.isEdge(r, c) || this.checkAdj(r, c, h)
  }

  isEdge(r: number, c: number) {
    return (
      r === 0 ||
      c === 0 ||
      r === this.grid.length - 1 ||
      c === this.grid[0].length - 1
    )
  }

  checkAdj(r: number, c: number, h: number) {
    const adjTrees = Object.entries(this.getAdj(r, c)) as Entries<AdjTrees>

    return adjTrees.some(([adjSide, adjHeights]) =>
      adjHeights.every((adjHeight) => adjHeight < h),
    )
  }

  getAdj(r: number, c: number): AdjTrees {
    return this.grid.reduce<AdjTrees>(
      (acc, row, rowI) => {
        if (r === rowI) {
          acc = row.reduce((acc, h, colI) => {
            if (colI < c) {
              acc.l.push(h)
            } else if (colI > c) {
              acc.r.push(h)
            }
            return acc
          }, acc)
        }

        if (rowI < r) {
          acc.t.push(row[c])
        } else if (rowI > r) {
          acc.b.push(row[c])
        }

        return acc
      },
      {
        l: [],
        r: [],
        t: [],
        b: [],
      },
    )
  }
}

class D8 extends Solver {
  treeGrid: TreeGrid

  constructor() {
    super(2022, 8)

    this.treeGrid = new TreeGrid(this.getInput())
  }

  partOne(): string | number {
    return this.treeGrid.visibleCount
  }

  partTwo(): string | number {
    return Math.max(...this.treeGrid.scenicScores)
  }
}

export default D8
