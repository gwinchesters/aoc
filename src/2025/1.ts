import Solver from '../common/base'
import { parse } from '../utils/input'

type Instruction = {
  direction: 'L' | 'R'
  distance: number
}

const getDial = (start = 50) => {
  let position = start

  const rotate = ({
    direction,
    distance,
  }: Instruction): { fullRotations: number; afterRotate: number } => {
    const fullRotations = Math.floor(distance / 100)
    const relDistance = distance % 100
    if (direction == 'L') {
      return {
        fullRotations,
        afterRotate: position - relDistance,
      }
    }

    return { fullRotations, afterRotate: position + relDistance }
  }

  const resolveRotation = (
    afterRotate: number,
  ): { pastZero: boolean; resolvedPosition: number } => {
    if (afterRotate > 99) {
      return {
        pastZero: true,
        resolvedPosition: -1 + (afterRotate - 99),
      }
    }
    if (afterRotate < 0) {
      return {
        pastZero: true,
        resolvedPosition: 100 + afterRotate,
      }
    }
    return {
      pastZero: false,
      resolvedPosition: afterRotate,
    }
  }

  return (
    intructions: Instruction[],
    audit: (fullRotations: number, newPosition: number) => void,
  ) => {
    for (const i of intructions) {
      const { fullRotations, afterRotate } = rotate(i)
      const { pastZero, resolvedPosition } = resolveRotation(afterRotate)

      let zeroClicks = 0

      if (position == 0) {
        // started at zero
        zeroClicks += fullRotations
      } else if (resolvedPosition == 0) {
        // ended at zero
        zeroClicks += fullRotations + 1
      } else {
        zeroClicks += fullRotations + (pastZero ? 1 : 0)
      }

      audit(resolvedPosition, zeroClicks)

      position = resolvedPosition
    }
  }
}

class D1 extends Solver {
  constructor() {
    super(2025, 1)
  }

  parseInstructions(input = 'main'): Instruction[] {
    return parse(input, '\n', (line) => {
      const match = line.match(/^(?<direction>L|R)(?<distance>\d*)/)

      if (!match) return undefined

      const direction = match.groups?.direction
      const distance = match.groups?.distance

      if (!direction || !distance) return undefined

      return {
        direction,
        distance: Number(distance),
      } as Instruction
    })
  }

  partOne(): string | number {
    const instructions = this.parseInstructions('main')
    const dial = getDial()

    let zeroCount = 0

    dial(instructions, (np) => {
      zeroCount += np ? 0 : 1
    })

    return zeroCount
  }

  partTwo(): string | number {
    const instructions = this.parseInstructions('main')
    const dial = getDial()

    let zeroCount = 0

    dial(instructions, (_, zc) => {
      zeroCount += zc
    })

    return zeroCount
  }
}

export default D1
