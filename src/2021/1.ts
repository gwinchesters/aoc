import Solver from '../common/base'

class D1 extends Solver {
  constructor() {
    super(2021, 1)
  }

  getDepths(): number[] {
    return this.getInput().map((d) => Number(d))
  }

  partOne(): string | number {
    return this.getDepths().reduce((acc, d, i, depths) => {
      if (depths[i - 1] !== undefined && depths[i - 1] < d) {
        return acc + 1
      }
      return acc
    }, 0)
  }
  partTwo(): string | number {
    return this.getDepths().reduce((acc, d, i, depths) => {
      if (depths[i - 1] !== undefined && depths[i - 1] < d) {
        return acc + 1
      }
      return acc
    }, 0)
  }
}

export default D1
