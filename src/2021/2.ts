import { Tup } from '../utils/type'
import Solver from '../common/base'

type CmdParser<P> = {
  [move in 'f' | 'u' | 'd']: (pos: P, delta: number) => P
}

type Cmd = [cmd: keyof CmdParser<any>, delta: number]

class D2 extends Solver {
  constructor() {
    super(2021, 2)
  }

  getCmds(input = this.getInput()): Cmd[] {
    return input.map((l) => {
      const { groups } = l.match(/(?<cmd>f|u|d)\w*\s(?<delta>\d+)/)!

      return [groups!.cmd, Number(groups!.delta)] as Cmd
    })
  }

  partOne(): string | number {
    type SubPos = [x: number, y: number]
    const parser: CmdParser<SubPos> = {
      f: ([x, y], delta) => [x + delta, y],
      u: ([x, y], delta) => [x, y - delta],
      d: ([x, y], delta) => [x, y + delta],
    }

    const [x, y] = this.getCmds().reduce(
      (pos: SubPos, [cmd, delta]: Cmd) => {
        return parser[cmd](pos, delta)
      },
      [0, 0] as SubPos,
    )

    return x * y
  }

  partTwo(): string | number {
    type SubPos = [x: number, y: number, a: number]
    const parser: CmdParser<SubPos> = {
      f: ([x, y, a], delta) => [x + delta, y + a * delta, a],
      d: ([x, y, a], delta) => [x, y, a + delta],
      u: ([x, y, a], delta) => [x, y, a - delta],
    }

    const [x, y] = this.getCmds().reduce(
      (pos: SubPos, [cmd, delta]: Cmd) => {
        return parser[cmd](pos, delta)
      },
      [0, 0, 0] as SubPos,
    )

    return x * y
  }
}

export default D2
