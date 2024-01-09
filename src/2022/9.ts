import Solver from '../common/base'

interface Move {
  direction: 'U' | 'D' | 'L' | 'R'
  distance: number
}
type Position = [number, number]

class Rope {
  knots: Position[]
  tailHistory: Set<string>

  constructor(size: number) {
    this.knots = Array(size)
      .fill(null)
      .map(() => [0, 0])
    this.tailHistory = new Set([this.tail.toString()])
  }

  get tail() {
    return this.knots[this.knots.length - 1]
  }

  get head() {
    return this.knots[0]
  }

  executeMoves(moves: Move[]) {
    for (let move of moves) {
      this.move(move)
    }
  }

  move(m: Move) {
    if (m.distance === 0) {
      return
    }

    this.knots[0] = this.moveHead(m.direction)

    this.adjustKnots()

    m.distance--

    this.move(m)
  }

  moveHead(direction: Move['direction']): Position {
    const [x, y] = this.head

    switch (direction) {
      case 'U':
        return [x, y + 1]
      case 'D':
        return [x, y - 1]
      case 'L':
        return [x - 1, y]
      case 'R':
        return [x + 1, y]
    }
  }

  adjustKnots(index: number = 1) {
    if (index === this.knots.length) {
      this.tailHistory.add(this.tail.toString())
      return
    }

    const knot = this.knots[index]
    const leadKnot = this.knots[index - 1]

    if (!this.areKnotsAdjacent(knot, leadKnot)) {
      this.knots[index] = this.getKnotAdjustment(knot, leadKnot)
    }

    this.adjustKnots(index + 1)
  }

  areKnotsAdjacent([tx, ty]: Position, [lx, ly]: Position) {
    return Math.floor(Math.sqrt((lx - tx) ** 2 + (ly - ty) ** 2)) <= 1
  }

  getKnotAdjustment([tx, ty]: Position, [lx, ly]: Position): Position {
    const dX = lx - tx
    const dY = ly - ty
    const slope = dY / dX

    if (Math.abs(slope) === 0) {
      // Horizontal
      return [tx + dX / Math.abs(dX), ty]
    } else if (Math.abs(slope) === Number.POSITIVE_INFINITY) {
      // Vertical
      return [tx, ty + dY / Math.abs(dY)]
    }

    // Diagonal
    return [tx + dX / Math.abs(dX), ty + dY / Math.abs(dY)]
  }
}

class D9 extends Solver {
  constructor() {
    super(2022, 9)
  }

  genMoves() {
    return this.getInput().map((rawMove) => {
      const moveMatch = rawMove.match(/([U|D|L|R]{1}) (\d+)/)

      return {
        direction: moveMatch?.[1] as Move['direction'],
        distance: Number(moveMatch?.[2]) as Move['distance'],
      }
    })
  }

  partOne(): string | number {
    const rope = new Rope(2)
    rope.executeMoves(this.genMoves())
    return rope.tailHistory.size
  }

  partTwo(): string | number {
    const rope = new Rope(10)
    rope.executeMoves(this.genMoves())
    return rope.tailHistory.size
  }
}

export default D9
