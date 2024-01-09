import Solver from '../common/base'
import { Range } from '../utils/type'

interface Race {
  length: number
  record: number
}

export default class D6 extends Solver {
  constructor() {
    super(2023, 6)
  }

  parseRaces(input = this.getInput()) {
    const raceLengths = [...input[0].matchAll(/\d+/g)].map(([t]) => Number(t))
    const raceRecords = [...input[1].matchAll(/\d+/g)].map(([t]) => Number(t))

    return raceLengths.reduce((races, length, i) => {
      return [
        ...races,
        {
          length,
          record: raceRecords[i],
        },
      ]
    }, [] as Race[])
  }

  getValidator({ length, record }: Race) {
    return (t: number) => (length - t) * t > record
  }

  // Brute force
  findWinningChargeTimes(r: Race) {
    const validator = this.getValidator(r)

    let winLB = 0
    let winUB = 0

    for (let t = 1; t < r.length; t++) {
      if (validator(t)) {
        if (!winLB) {
          winLB = t
        } else {
          winUB = t
        }
      }
    }

    return winUB - winLB + 1
  }

  partOne(): string | number {
    const races = this.parseRaces()

    const errorMargins = races.reduce((em, r) => {
      const winningTimes = this.findWinningChargeTimes(r)

      return em * winningTimes
    }, 1)

    return errorMargins
  }

  findFirstWinningTime(
    [lb, ub]: Range,
    validator: (t: number) => boolean,
  ): number {
    const diff = ub - lb

    if (diff === 1) {
      return validator(lb) ? lb : ub
    }

    const mid = lb + Math.round(diff / 2)

    const newRange: Range = validator(mid) ? [lb, mid] : [mid, ub]

    return this.findFirstWinningTime(newRange, validator)
  }

  partTwo(): string | number {
    const races = this.parseRaces()
    const revisedRace = {
      length: Number(races.map(({ length }) => length).join('')),
      record: Number(races.map(({ record }) => record).join('')),
    }
    const validator = this.getValidator(revisedRace)
    const winningLB = this.findFirstWinningTime(
      [0, revisedRace.length],
      validator,
    )
    const winningUB = Math.ceil(
      (1 - winningLB / revisedRace.length) * revisedRace.length,
    )
    const winningTimes = winningUB - winningLB + 1

    return winningTimes
  }
}
