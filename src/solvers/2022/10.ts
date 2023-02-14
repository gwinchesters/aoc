import Solver from '../base'
import { Entries } from '../../utils/type'

interface Register {
  x: number
}

interface Operation {
  instruction: 'noop' | 'addx'
  value?: number
}

type Program = Operation[]

class CPU {
  register: Register = { x: 1 }
  cycle: number = 0

  execute(program: Program, tickCallback: (cycle: number, x: number) => void) {
    this.cycle = 0
    this.register.x = 1
    for (let op of program) {
      this.tick(tickCallback)
      if (op.instruction === 'addx') {
        if (op.value) {
          this.tick(tickCallback)
          this.register.x += op.value
        } else {
          throw Error(`Operation addx has no value`)
        }
      }
    }
  }

  tick(tickCallback: (cycle: number, x: number) => void) {
    this.cycle++
    tickCallback(this.cycle, this.register.x)
  }
}

class D10 extends Solver {
  cpu: CPU
  constructor() {
    super(2022, 10)
    this.cpu = new CPU()
  }

  genProgram(): Program {
    return this.getInput().map((rawInstruction) => {
      if (rawInstruction === 'noop') {
        return { instruction: 'noop' }
      }

      return {
        instruction: 'addx',
        value: Number(
          rawInstruction.match(/addx (.*)/)?.[1],
        ) as Operation['value'],
      }
    })
  }

  partOne(): string | number {
    const signalStrengths: { [cycle: number]: number } = {}
    const auditSignalStrength = (cycle: number, x: number) => {
      const initial = 20
      const interval = 40

      if (cycle === initial || (cycle - initial) % interval === 0) {
        signalStrengths[cycle] = Number(x)
      }
    }
    this.cpu.execute(this.genProgram(), auditSignalStrength)
    return Object.entries(signalStrengths).reduce((acc, [cycle, x]) => {
      return acc + Number(cycle) * x
    }, 0)
  }

  partTwo(): string | number {
    const crt: string[][] = []
    let crtRow: string[] = []

    const draw = (cycle: number, x: number) => {
      const pixelPosition = (cycle - 1) % 40

      if (pixelPosition >= x - 1 && pixelPosition <= x + 1) {
        crtRow.push('#')
      } else {
        crtRow.push('.')
      }

      if (pixelPosition === 39) {
        crt.push(crtRow)
        crtRow = []
      }
    }

    this.cpu.execute(this.genProgram(), draw)
    return '\n' + crt.map((r) => r.join('')).join('\n')
  }
}

export default D10
