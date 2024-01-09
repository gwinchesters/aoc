import Solver from '../common/base'

export default class D1 extends Solver {
  constructor() {
    super(2022, 1)
  }

  parseItems(input = this.getTestInput()) {
    const allItems = []
    while (input.indexOf('') != -1) {
      allItems.push(input.slice(0, input.indexOf('')).map((i) => Number(i)))
      input = input.slice(input.indexOf('') + 1)
    }

    allItems.push(input.map((i) => Number(i)))

    return allItems
  }

  partOne(): string | number {
    const elfTotals = this.parseItems(this.getInput()).map((elfItems) => {
      return elfItems.reduce((a, b) => a + b)
    })
    elfTotals.sort((a, b) => b - a)
    return elfTotals[0]
  }

  partTwo(): string | number {
    const elfTotals = this.parseItems(this.getInput()).map((elfItems) => {
      return elfItems.reduce((a, b) => a + b)
    })
    elfTotals.sort((a, b) => b - a)
    return elfTotals.slice(0, 3).reduce((a, b) => a + b)
  }
}
