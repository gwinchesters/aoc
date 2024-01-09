import Solver from '../common/base'

interface Move {
  crates: number
  from: number
  to: number
}

interface Stacks {
  [stack: number]: string[]
}

class D5 extends Solver {
  //input: string[]
  stacks: Stacks
  moves: Move[]

  constructor() {
    super(2022, 5)

    this.initStacks()
    this.initMoves()
  }

  initStacks() {
    const input = this.getInput()

    const stacks = input
      .slice(0, input.indexOf(''))
      .slice(-1)[0]
      .replaceAll(/\s/g, '')
      .split('')
      .reduce((acc, s) => {
        return {
          ...acc,
          [Number(s)]: [],
        }
      }, {} as { [stack: number]: string[] })

    input
      .slice(0, input.indexOf('') - 1)
      .map((c) => c.replaceAll(/\s{4}/g, ' [x] ').trim())
      .map((c) => c.match(/([(A-Za-z)])/gi))
      .reverse()
      .forEach((crates) => {
        if (crates) {
          crates.forEach((c, i) => {
            if (c !== 'x') {
              stacks[i + 1].push(c)
            }
          })
        }
      })

    this.stacks = stacks
  }

  initMoves() {
    const input = this.getInput()
    const moves = input.slice(input.indexOf('') + 1)

    this.moves = moves.reverse().map((mv) => {
      const move = mv.match(/move (\d*) from (\d*) to (\d*)/)
      const [_, crates, from, to] = move || []

      return {
        crates: Number(crates),
        from: Number(from),
        to: Number(to),
      }
    })
  }

  getNextMove(
    i: number,
    moves: Move[],
  ): { move: Move | undefined; moves: Move[] } {
    const movesCopy = [...moves]
    const move = movesCopy.pop()

    return {
      move,
      moves: movesCopy,
    }
  }

  processMove9000(move: Move, stacks: Stacks): Stacks {
    const stacksCopy = { ...stacks }
    const { crates, from, to } = move

    let numCrates = 1

    while (numCrates <= crates) {
      const crate = stacksCopy[from].pop()

      if (crate) {
        stacksCopy[to].push(crate)
      }

      numCrates++
    }

    return stacksCopy
  }

  processMove9001(move: Move, stacks: Stacks): Stacks {
    const stacksCopy = { ...stacks }
    const { crates, from, to } = move

    const moveCrates = stacksCopy[from].slice(stacksCopy[from].length - crates)

    stacksCopy[to] = [...stacksCopy[to], ...moveCrates]
    stacksCopy[from] = stacksCopy[from].slice(0, -crates)

    return stacksCopy
  }

  partOne(): string | number {
    let stacks = { ...this.stacks }
    let i = 0
    let nextMove = null
    let remainingMoves = [...this.moves]
    const { move, moves } = this.getNextMove(i, remainingMoves)
    nextMove = move
    remainingMoves = moves

    while (nextMove) {
      stacks = { ...this.processMove9000(nextMove, stacks) }
      i++
      const { move, moves } = this.getNextMove(i, remainingMoves)
      nextMove = move
      remainingMoves = [...moves]
    }

    return Object.values(stacks)
      .map((s) => s.pop())
      .join('')
  }

  partTwo(): string | number {
    let stacks = { ...this.stacks }
    let i = 0
    let nextMove = null
    let remainingMoves = [...this.moves]
    const { move, moves } = this.getNextMove(i, remainingMoves)
    nextMove = move
    remainingMoves = moves

    while (nextMove) {
      stacks = { ...this.processMove9001(nextMove, stacks) }
      i++
      const { move, moves } = this.getNextMove(i, remainingMoves)
      nextMove = move
      remainingMoves = [...moves]
    }

    return Object.values(stacks)
      .map((s) => s.pop())
      .join('')
  }
}

export default D5
