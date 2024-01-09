import Solver from '../common/base'

interface Node {
  key: string
  L: string
  R: string
}

class DesertMap {
  path: string[]
  nodes: { [key: string]: Node }

  constructor(path: string, nodes: Node[]) {
    this.path = path.split('')
    this.nodes = nodes.reduce((nm, n) => {
      return {
        ...nm,
        [n.key]: n,
      }
    }, {})
  }

  traverse(key: string, destination: RegExp): number {
    let pathIdx = 0
    let stepCount = 0
    while (!destination.test(key)) {
      if (pathIdx === this.path.length) {
        pathIdx = 0
      }

      const move = this.path[pathIdx] as keyof Node

      key = this.nodes[key][move]
      pathIdx++
      stepCount++
    }

    return stepCount
  }
}

export default class D8 extends Solver {
  constructor() {
    super(2023, 8)
  }

  parseMap(input = this.getInput()) {
    const nodes = input.slice(2).map((l) => {
      const [_, key, L, R] =
        l.match(/(\w{3})\s=\s\((\w{3}),\s(\w{3})\)/) ?? ({} as RegExpMatchArray)

      return {
        key,
        L,
        R,
      } as Node
    })

    return new DesertMap(input[0], nodes)
  }

  partOne(): string | number {
    const map = this.parseMap()

    const steps = map.traverse('AAA', /ZZZ/)

    return steps
  }

  factor(n: number): number[] {
    const root = Math.floor(Math.sqrt(n))
    let d = root

    while (n % d !== 0) {
      d -= 1
    }

    return [d, n / d]
  }

  isPrime(n: number, i = 2): boolean {
    if (n === 0 || n === 1) {
      return false
    }

    if (n === i) {
      return true
    }

    if (n % i === 0) {
      return false
    }

    return this.isPrime(n, ++i)
  }

  primeFactors(n: number) {
    if (this.isPrime(n)) {
      return [n]
    }
    const toFactor = [n]
    const pf: number[] = []

    while (toFactor.length) {
      const num = toFactor.pop()
      if (num) {
        this.factor(num).forEach((f) => {
          if (this.isPrime(f)) {
            pf.push(f)
          } else {
            toFactor.push(f)
          }
        })
      }
    }

    return pf
  }

  lcm(nums: number[]) {
    const primeFactors = nums.map((n) => this.primeFactors(n))

    const pfsWithPowers = primeFactors.reduce((expMap, pfs) => {
      const uniqueFactors = [...new Set(pfs)]

      uniqueFactors.forEach((f) => {
        if (!expMap[f]) {
          expMap[f] = 1
        }
        const exp = pfs.filter((pf) => pf === f).length

        if (exp > expMap[f]) {
          expMap[f] = exp
        }
      })

      return expMap
    }, {} as { [pf: number]: number })

    return Object.entries(pfsWithPowers).reduce((p, [n, exp]) => {
      return p * Math.pow(Number(n), exp)
    }, 1)
  }

  partTwo(): string | number {
    const map = this.parseMap()

    const keys = Object.keys(map.nodes).filter((k) => /[\w]{2}A/.test(k))

    const steps = keys.map((k) => map.traverse(k, /[\w]{2}Z/))

    return this.lcm(steps)
  }
}
