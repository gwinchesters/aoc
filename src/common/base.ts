import { parseInput } from '../utils/input'

abstract class Solver {
  year: number
  day: number

  constructor(year: number, day: number) {
    this.year = year
    this.day = day
  }

  get name() {
    return `${this.year}-${this.day}`
  }

  getInput(): string[] {
    return parseInput('main')
  }

  getTestInput(): string[] {
    return parseInput('test')
  }

  abstract partOne(): string | number

  abstract partTwo(): string | number
}

export default Solver
