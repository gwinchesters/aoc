import Solver from '../common/base'

export default class D9 extends Solver {
  constructor() {
    super(2023, 9)
  }

  parseReport(input = this.getInput()) {
    return input.map((l) => l.split(' ').map(Number))
  }

  simplifySeq(seq: number[]) {
    return seq.reduce((nSeq, n, i) => {
      if (i === seq.length - 1) {
        return nSeq
      }

      return [...nSeq, seq[i + 1] - n]
    }, [] as number[])
  }

  simplifyHistory(history: number[]) {
    const steps = []
    let currentSeq = [...history]

    while (!currentSeq.every((v) => v === 0)) {
      steps.push(currentSeq)
      currentSeq = this.simplifySeq(currentSeq)
    }

    steps.push(currentSeq)

    return steps
  }

  predictNextValue(historySteps: number[][]) {
    const lastVals = historySteps
      .map((steps) => steps[steps.length - 1])
      .reverse()

    for (let i = 0; i < lastVals.length; i++) {
      const lastNum = lastVals[i]
      const belowNum = lastVals[i - 1] ?? 0
      lastVals[i] = lastNum + belowNum
    }

    return lastVals.pop() ?? 0
  }

  partOne(): string | number {
    const report = this.parseReport()

    return report.reduce((sumNxtVals, history) => {
      const steps = this.simplifyHistory(history)

      return sumNxtVals + this.predictNextValue(steps)
    }, 0)
  }

  predictFirstValue(historySteps: number[][]) {
    const firstVals = historySteps.map((steps) => steps[0]).reverse()

    for (let i = 0; i < firstVals.length; i++) {
      const lastNum = firstVals[i]
      const belowNum = firstVals[i - 1] ?? 0
      firstVals[i] = lastNum - belowNum
    }

    return firstVals.pop() ?? 0
  }

  partTwo(): string | number {
    const report = this.parseReport()

    return report.reduce((sumNxtVals, history) => {
      const steps = this.simplifyHistory(history)

      return sumNxtVals + this.predictFirstValue(steps)
    }, 0)
  }
}
