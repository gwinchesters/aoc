import Solver from '../common/base'
type Op = '+' | '*' | '|'

export default class D7 extends Solver {
  permutations: { [len: number]: string[] }

  constructor() {
    super(2024, 7)
  }

  permutator(len: number, chars = ['+', '*']): string[] {
    if (this.permutations[len]) {
      return this.permutations[len]
    }

    const results: string[] = []

    function permute(p: string) {
      if (p.length === len) {
        results.push(p)
        return
      }

      for (const letter of chars) {
        permute(p + letter)
      }
    }

    permute('')
    this.permutations[len] = results as Op[]
    return results as Op[]
  }

  getProblems(input = this.getInput()) {
    return input.map((line) => {
      const [result, nums] = line.split(': ')

      return {
        test: Number(result),
        nums: nums.split(' ').map(Number),
      }
    })
  }

  testOps(nums: number[], ops: Op[], target: number): boolean {
    if (ops.length === 0 || nums[0] > target) {
      return nums.shift() === target
    }

    const op = ops.shift()
    const numA = nums.shift()
    const numB = nums.shift()

    if (!numA || !numB) {
      throw Error('Nums not defined')
    }

    if (op === '+') {
      nums = [numA + numB, ...nums]
    } else if (op === '*') {
      nums = [numA * numB, ...nums]
    } else if (op === '|') {
      nums = [Number(numA.toString() + numB.toString()), ...nums]
    }

    return this.testOps(nums, ops, target)
  }

  partOne(): string | number {
    this.permutations = {}
    const problems = this.getProblems()

    return problems.reduce<number>((validTests, { test, nums }) => {
      const canCompute = this.permutator(nums.length - 1).some((ops) =>
        this.testOps([...nums], ops.split('') as Op[], test),
      )
      return canCompute ? validTests + test : validTests
    }, 0)
  }

  partTwo(): string | number {
    this.permutations = {}
    const problems = this.getProblems()

    return problems.reduce<number>((validTests, { test, nums }) => {
      const canCompute = this.permutator(nums.length - 1, ['*', '+', '|']).some(
        (ops) => this.testOps([...nums], ops.split('') as Op[], test),
      )
      return canCompute ? validTests + test : validTests
    }, 0)
  }
}
