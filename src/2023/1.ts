import Solver from '../common/base'

class D1 extends Solver {
  constructor() {
    super(2023, 1)
  }

  findDigits(line: string, regex: RegExp) {
    return [...line.matchAll(regex)].map(([_, d]) => d)
  }

  partOne(): string | number {
    const regex = new RegExp(/(?=(\d))/g)
    return this.getInput().reduce((total, line) => {
      const digits = this.findDigits(line, regex)
      return total + Number(`${digits[0]}${digits.slice(-1)[0]}`)
    }, 0)
  }

  partTwo(): string | number {
    const nums = [
      'one',
      'two',
      'three',

      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ]
    const regex = new RegExp(`(?=(\\d|${nums.join('|')}))`, 'g')

    const parseDigit = (d: string) => {
      return nums.indexOf(d) >= 0 ? nums.indexOf(d) + 1 : d
    }

    return this.getInput().reduce((total, line) => {
      const digits = this.findDigits(line, regex)
      return (
        total +
        Number(`${parseDigit(digits[0])}${parseDigit(digits.slice(-1)[0])}`)
      )
    }, 0)
  }
}

export default D1
