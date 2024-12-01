import Solver from '../common/base'

class D1 extends Solver {
  constructor() {
    super(2024, 1)
  }

  parseLists(input = this.getInput()) {
    return input.reduce<{ l: number[]; r: number[] }>(
      ({ l, r }, line) => {
        const [f, s] = line.split(/\s+/)
        return {
          l: [...l, Number(f)],
          r: [...r, Number(s)],
        }
      },
      { l: [], r: [] },
    )
  }

  partOne(): string | number {
    const { l, r } = this.parseLists(this.getInput())

    l.sort()
    r.sort()

    const diffTotal = l.reduce((diff, leftNum, i) => {
      return diff + Math.abs(leftNum - r[i])
    }, 0)

    return diffTotal
  }

  partTwo(): string | number {
    const { l, r } = this.parseLists(this.getInput())

    const leftCounts = r.reduce<{ [num: number]: number }>(
      (indexedCounts, num) => {
        return {
          ...indexedCounts,
          [num]: (indexedCounts[num] ?? 0) + 1,
        }
      },
      {} as { [num: number]: number },
    )

    return l.reduce((scoreTotal, num) => {
      return scoreTotal + num * (leftCounts[num] ?? 0)
    }, 0)
  }
}

export default D1
