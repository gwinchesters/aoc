import Solver from '../common/base'

class D3 extends Solver {
  constructor() {
    super(2024, 3)
  }

  partOne(): string | number {
    return this.getInput().reduce<number>((total, line) => {
      const matches = line.matchAll(/mul\((?<x>\d{1,3}),(?<y>\d{1,3})\)/g)
      return [...matches].reduce<number>((total, { groups }) => {
        return total + Number(groups?.x) * Number(groups?.y)
      }, total)
    }, 0)
  }

  partTwo(): string | number {
    let skip = false
    return this.getInput().reduce<number>((total, line) => {
      const matches = line.matchAll(
        /mul\((?<x>\d{1,3}),(?<y>\d{1,3})\)|(?<skip_op>do|don\'t)\(\)/g,
      )
      return [...matches].reduce<number>((total, { groups }) => {
        if (groups?.skip_op) {
          skip = groups.skip_op !== 'do'
          return total
        }

        if (skip) {
          return total
        }

        return total + Number(groups?.x) * Number(groups?.y)
      }, total)
    }, 0)
  }
}

export default D3
