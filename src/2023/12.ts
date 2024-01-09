import Solver from '../common/base'

const trimString = (str: string, char: string) => {
  str = str.replace(new RegExp(`^\\${char}*`), '')
  str = str.replace(new RegExp(`\\${char}*$`), '')

  return str
}

const countChars = (
  str: string,
  char: string,
  options?: { lead?: boolean; trail?: boolean },
) => {
  const { lead = false, trail = false } = options ?? {}
  return (
    str.match(
      new RegExp(`${lead ? '^' : ''}\\${char}${trail ? '$' : ''}`, 'g'),
    ) || []
  ).length
}

class RowConfig {
  config: string
  groups: number[]
  totalBroken: number
  knownBroken: number
  unknown: number
  required: number

  constructor(config: string, groups: string) {
    this.config = config
    this.groups = groups.split(',').map(Number)

    this.totalBroken = this.groups.reduce((a, b) => a + b, 0)
    this.knownBroken = (this.config.match(/\#/g) || []).length
    this.unknown = (this.config.match(/\?/g) || []).length
    this.required = this.totalBroken - this.knownBroken
  }

  get regex() {
    return new RegExp(
      `^\\.*${this.groups.map((g) => `(\\#{${g}})`).join('\\.+')}\\.*$`,
    )
  }

  mergePermutation(p: string) {
    return this.config.split('?').reduce((merged, part, i) => {
      return merged + part + p.charAt(i)
    }, '')
  }

  get allValidPermutations() {
    const permutations = this.permute('', this.required, this.unknown).map(
      (p) => this.mergePermutation(p),
    )

    return permutations.filter((p) => this.regex.test(p))
  }

  permute(
    str: string,
    required: number,
    unknowns: number,
    ps = [] as string[],
  ) {
    if (countChars(str, '#') > required) {
      return ps
    }

    if (unknowns === 0) {
      if (countChars(str, '#') === required) {
        ps.push(str)
      }
      return ps
    }

    if (countChars(str, '#') + unknowns < required) {
      return ps
    }

    ps = this.permute(str + '#', required, unknowns - 1, ps)
    ps = this.permute(str + '.', required, unknowns - 1, ps)

    return ps
  }
}

export default class D12 extends Solver {
  constructor() {
    super(2023, 12)
  }

  parseInput(input = this.getInput()) {
    return input.map((l) => l.split(' '))
  }

  partOne(): string | number {
    // const rows = this.parseInput().map(([c, g]) => new RowConfig(c, g))

    // return rows.reduce((totalConfigs, row) => {
    //   return totalConfigs + row.allValidPermutations.length
    // }, 0)
    return ''
  }

  partTwo(): string | number {
    const rows = this.parseInput(this.getTestInput()).map(([c, g]) => {
      return new RowConfig([c, c, c].join('?'), [g, g, g].join(','))
    })

    console.log(rows[2].allValidPermutations)

    return ''

    // return rows.reduce((totalConfigs, row) => {
    //   return totalConfigs + row.allValidPermutations.length
    // }, 0)
  }
}
