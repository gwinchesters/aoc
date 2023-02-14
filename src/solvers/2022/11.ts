import Solver from '../base'

interface Operation {
  operand: 'add' | 'multiply'
  modifier: number | null
}

interface Test {
  divisor: number
  resultPath: { pass: number; fail: number }
}

class Monkey {
  id: number
  items: number[]
  operation: Operation
  test: Test
  inspectionCount: number = 0
  manageLvls: boolean

  constructor(
    id: number,
    items: number[],
    operation: Operation,
    test: Test,
    manageLvls: boolean = true,
  ) {
    this.id = id
    this.items = items
    this.operation = operation
    this.test = test
    this.manageLvls = manageLvls
  }

  hasItems() {
    return this.items.length > 0
  }

  inspect() {
    let item = this.items.shift()
    if (!item) {
      throw Error('Monkey has no items')
    }

    this.inspectionCount++
    item = this.exeOperation(item)
    item = this.manageLvls ? Math.floor(item / 3) : item
    return this.exeTest(item)
  }

  inspectAlt() {
    const opOutcomes = []
    while (this.hasItems()) {
      const item = this.items.shift()
      if (!item) {
        throw Error('Monkey has no items')
      }

      this.inspectionCount++
      opOutcomes.push(this.exeOperation(item))
    }

    if (!this.hasItems()) {
      return []
    }

    const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

    const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

    const modMod = opOutcomes.reduce(lcm)

    const reduceWorry = (item: number) => {
      if (this.manageLvls) {
        return Math.floor(item / 3)
      }

      return item % modMod
    }

    return opOutcomes.map((item) => {
      return this.exeTest(reduceWorry(item))
    })
  }

  exeOperation(item: number): number {
    const modifier = this.operation.modifier || item

    if (this.operation.operand === 'add') {
      return item + modifier
    }

    return item * modifier
  }

  exeTest(item: number): [number, number] {
    const { divisor, resultPath } = this.test

    const testResult = item % divisor === 0

    return [item, testResult ? resultPath.pass : resultPath.fail]
  }
}

class MonkeyGame {
  monkeys: Monkey[]

  constructor(monkeys: Monkey[]) {
    this.monkeys = monkeys
  }

  print(rnd: number) {
    console.log(`After Round: ${rnd}`)
    for (let m of this.monkeys) {
      console.log(`Monkey ${m.id} inspected items ${m.inspectionCount} times.`)
    }
    console.log('\n')
  }

  play(rnds: number = 20, print: boolean = false) {
    let rnd = 1
    while (rnd <= rnds) {
      this.playRound()

      if ((print && rnd === 1) || rnd === 20 || rnd % 1000 === 0) {
        this.print(rnd)
      }
      rnd++
    }
  }

  playRound() {
    for (let monkey of this.monkeys) {
      const throws = monkey.inspectAlt()

      for (let t of throws) {
        this.throwItem(t[0], t[1])
      }
    }
  }

  throwItem(item: number, monkeyId: number) {
    const reciever = this.monkeys.find((m) => m.id === monkeyId)

    reciever?.items.push(item)
  }
}

class D11 extends Solver {
  constructor() {
    super(2022, 11)
  }

  genMonkeys(manageLvls: boolean = true) {
    const input = this.getTestInput()

    const monkeys: Monkey[] = []

    while (input.length > 0) {
      const config = input.splice(0, 7)

      const id = Number(config[0].match(/Monkey (\d+):/)?.[1])
      const items = config[1]
        .replace('Starting items: ', '')
        .split(',')
        .map((i) => Number(i))

      const op = config[2].replace('Operation: new = old ', '')
      const operand = op.indexOf('+') !== -1 ? 'add' : 'multiply'
      const modMatch = op.match(/[+|*] (\d+)/)

      const operation: Operation = {
        operand,
        modifier: modMatch ? Number(modMatch[1]) : null,
      }

      const test: Test = {
        divisor: Number(config[3].replace('Test: divisible by ', '')),
        resultPath: {
          pass: Number(config[4].replace('If true: throw to monkey ', '')),
          fail: Number(config[5].replace('If false: throw to monkey ', '')),
        },
      }

      monkeys.push(new Monkey(id, items, operation, test, manageLvls))
    }

    return monkeys
  }

  partOne(): string | number {
    // const game = new MonkeyGame(this.genMonkeys())

    // game.play(20)

    // const counts = game.monkeys
    //   .map((m) => m.inspectionCount)
    //   .sort((a, b) => b - a)

    // return counts[0] * counts[1]
    return ''
  }

  partTwo(): string | number {
    const game = new MonkeyGame(this.genMonkeys(false))
    game.play(20, true)

    const counts = game.monkeys
      .map((m) => m.inspectionCount)
      .sort((a, b) => b - a)

    return counts[0] * counts[1]
  }
}

export default D11
