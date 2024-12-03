import Solver from '../common/base'

class D2 extends Solver {
  constructor() {
    super(2024, 2)
  }

  parseReport(input = this.getInput()) {
    return input.reduce<number[][]>((reports, line) => {
      return [...reports, line.split(' ').map((lvl) => Number(lvl))]
    }, [])
  }

  verifyReport(report: number[], skip = -1) {
    const [idx1, idx2] = [0, 1, 2].filter((i) => i !== skip)
    const check = report[idx2] - report[idx1] > 0 ? 1 : 0
    let isSafe = true

    for (let i = 1; i < report.length; i++) {
      let prev = 1
      if (i === skip) {
        continue
      }

      if (i - 1 === skip) {
        if (i - 2 >= 0) {
          prev = 2
        } else {
          continue
        }
      }

      const diff = report[i] - report[i - prev]
      const validSign = !(check ^ (diff > 0 ? 1 : 0))
      const validDiff = Math.abs(diff) > 0 && Math.abs(diff) <= 3

      if (!validSign || !validDiff) {
        isSafe = false
        break
      }
    }

    return isSafe
  }

  partOne(): string | number {
    const reports = this.parseReport()

    return reports.reduce((safeCount, report) => {
      return safeCount + (this.verifyReport(report) ? 1 : 0)
    }, 0)
  }

  partTwo(): string | number {
    const reports = this.parseReport()

    return reports.reduce((safeCount, report) => {
      let isSafe = this.verifyReport(report)

      if (!isSafe) {
        for (let i = 0; i < report.length; i++) {
          if (this.verifyReport(report, i)) {
            isSafe = true
            break
          }
        }
      }

      return safeCount + (isSafe ? 1 : 0)
    }, 0)
  }
}

export default D2
