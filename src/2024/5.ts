import Solver from '../common/base'

type Rules = { [page: number]: number[] }

class D5 extends Solver {
  constructor() {
    super(2024, 5)
  }

  parseRulesAndUpdates(input = this.getInput()) {
    const splitIdx = input.indexOf('')

    const rawRules = input.slice(0, splitIdx)
    const rawUpdates = input.slice(splitIdx + 1)

    const rules = rawRules.reduce<{ [page: number]: number[] }>(
      (ruleMap, rule) => {
        const [p1, p2] = rule.split('|').map((p) => Number(p))
        const rules = ruleMap[p1] ?? []
        return {
          ...ruleMap,
          [p1]: [...rules, p2],
        }
      },
      {},
    )

    const updates = rawUpdates.reduce<number[][]>((parsedUpdates, update) => {
      return [...parsedUpdates, update.split(',').map((p) => Number(p))]
    }, [])

    return { rules, updates }
  }

  partOne(): string | number {
    const { rules, updates } = this.parseRulesAndUpdates(this.getInput())

    const sum = updates.reduce<number>((sum, update) => {
      const isValid = update.every((p, i, lst) => {
        const nxtPage = lst[i + 1]
        if (nxtPage && rules[nxtPage]?.includes(p)) {
          return false
        }
        return true
      })

      if (isValid) {
        return sum + update[Math.floor(update.length / 2)]
      }

      return sum
    }, 0)
    return sum
  }

  partTwo(): string | number {
    const { rules, updates } = this.parseRulesAndUpdates(this.getInput())

    const sum = updates.reduce<number>((sum, update) => {
      const isValid = update.every((p, i, lst) => {
        const nxtPage = lst[i + 1]
        if (nxtPage && rules[nxtPage]?.includes(p)) {
          return false
        }
        return true
      })

      if (!isValid) {
        update.sort((a, b) => {
          if (rules[a].includes(b)) {
            return -1
          } else if (rules[b]?.includes(a)) {
            return 1
          }
          return 0
        })
        return sum + update[Math.floor(update.length / 2)]
      }

      return sum
    }, 0)
    return sum
  }
}

export default D5
