import { Tup } from '../utils/type'
import Solver from '../common/base'

type Point = Tup<number>

type Dot = 'n' | 'e' | 's' | 'w'

class D6 extends Solver {
  constructor() {
    super(2024, 6)
  }

  parseMap(input = this.getInput()): { start: Point; map: string[][] } {
    return input.reduce<{ start: Point; map: string[][] }>(
      (inputMap, line, r) => {
        const startCol = line.indexOf('^')
        if (startCol >= 0) {
          inputMap.start = [r, startCol]
        }

        inputMap.map[r] = line.split('')

        return inputMap
      },
      { start: [0, 0], map: [] } as { start: Point; map: string[][] },
    )
  }

  nextMove: { [d in Dot]: Point } = {
    n: [-1, 0],
    e: [0, 1],
    s: [1, 0],
    w: [0, -1],
  }
  turnRight = (dot: Dot): Dot => {
    switch (dot) {
      case 'n':
        return 'e'
      case 'e':
        return 's'
      case 's':
        return 'w'
      case 'w':
        return 'n'
      default:
        return dot
    }
  }

  initHistory() {
    const history = new Map<number, Map<number, Set<Dot>>>()

    const seen = ([r, c]: Point, dot: Dot) => {
      return history.get(r)?.get(c)?.has(dot)
    }

    const add = ([r, c]: Point, dot: Dot) => {
      if (!history.has(r)) {
        history.set(r, new Map<number, Set<Dot>>())
      }

      if (!history.get(r)?.has(c)) {
        history.get(r)!!.set(c, new Set<Dot>())
      }

      history.get(r)?.get(c)?.add(dot)
    }

    const print = (map: string[][], start: Point) => {
      map.map((row, r) => {
        const rowHistory = row.map((cell, c) => {
          if (r === start[0] && c === start[1]) {
            return '^'
          }
          if (!history.get(r)?.has(c)) {
            return cell
          }

          const dots = history.get(r)!!.get(c)

          let NS = false
          let EW = false

          if (dots?.has('n') || dots?.has('s')) {
            NS = true
          }

          if (dots?.has('e') || dots?.has('w')) {
            EW = true
          }

          if (NS && EW) {
            return '+'
          }

          if (NS) {
            return '|'
          }

          if (EW) {
            return '-'
          }
          return cell
        })
        console.log(rowHistory.join(''))
      })
    }

    const visitedPoints = () => {
      const points = []

      for (const [row, colMap] of history) {
        for (const [col] of colMap) {
          points.push([row, col])
        }
      }

      return points
    }

    return { seen, print, add, visitedPoints }
  }

  solve(map: string[][], start: Point, trackHistory = false) {
    const nextMove: { [d in Dot]: Point } = {
      n: [-1, 0],
      e: [0, 1],
      s: [1, 0],
      w: [0, -1],
    }
    const turnRight = (dot: Dot): Dot => {
      switch (dot) {
        case 'n':
          return 'e'
        case 'e':
          return 's'
        case 's':
          return 'w'
        case 'w':
          return 'n'
        default:
          return dot
      }
    }
    const canMove = ([r, c]: Point) => !!map[r]?.[c]
    const shouldTurn = ([r, c]: Point) => map[r]?.[c] == '#'
    const nextPos = (pos: Point, nxtMove: Point) => {
      const [r, c] = pos
      const [rDelta, cDelta] = nxtMove
      return [r + rDelta, c + cDelta] as Point
    }

    const history: Point[] = []

    const saveMove = ([r, c]: Point) => {
      if (trackHistory) {
        if (!history.find(([prevR, prevC]) => prevR === r && prevC === c)) {
          history.push([r, c])
        }
      }
    }

    let pos: Point = start
    let dot: Dot = 'n'
    let didLoop = false

    const { seen, print, add, visitedPoints } = this.initHistory()

    while (canMove(pos)) {
      if (seen(pos, dot)) {
        didLoop = true
        break
      }

      // add to history
      add(pos, dot)

      // track move
      saveMove(pos)
      // move forward
      let nxt = nextPos(pos, nextMove[dot])
      // Turn if needed
      if (shouldTurn(nxt)) {
        dot = turnRight(dot)
        // Ensure history has change of direction, i.e. print +
        add(pos, dot)
        nxt = nextPos(pos, nextMove[dot])

        // 180 turn
        if (shouldTurn(nxt)) {
          dot = turnRight(dot)
          nxt = nextPos(pos, nextMove[dot])
        }
      }

      pos = nxt
    }

    return {
      history: visitedPoints(),
      didLoop,
      print,
    }
  }

  partOne(): string | number {
    const { start, map } = this.parseMap()
    const { history } = this.solve(map, start, true)

    return history.length
  }

  partTwo(): string | number {
    const { start, map } = this.parseMap()
    const { history } = this.solve(map, start, true)

    let loops = 0
    for (const [r, c] of history) {
      map[r][c] = '#'

      const { didLoop } = this.solve(map, start, false)

      if (didLoop) {
        loops++
        map[r][c] = 'O'
      }

      map[r][c] = '.'
    }
    return loops
  }
}

export default D6
