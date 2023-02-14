import Solver from '../base'

class SandSim {
  env: Map<number, Map<number, string>>
  floor: number | null
  height: number

  constructor(rocks: [number, number][], withFloor: boolean = false) {
    this.initEnv(rocks, withFloor)
  }

  initEnv(rocks: [number, number][], withFloor: boolean) {
    this.env = new Map<number, Map<number, string>>()
    let maxDepth = 0

    for (const [x, y] of rocks) {
      if (!this.env.has(x)) {
        this.env.set(x, new Map<number, string>())
      }

      this.env.get(x)!.set(y, 'rock')

      if (y > maxDepth) {
        maxDepth = y
      }
    }

    if (withFloor) {
      this.floor = maxDepth + 2
    }

    this.height = maxDepth + 2
  }

  checkEnv([x, y]: [number, number]) {
    return this.floor === y || this.env.get(x)?.has(y)
  }

  moveSand(sand: [number, number]): [number, number] | undefined {
    const canCollide = ([x, y]: [number, number]) => {
      if (this.floor) {
        return true
      }
      const ys = this.env.get(x)?.keys()
      if (!ys) {
        return false
      }
      return [...ys].some((envY) => envY >= y)
    }
    const fall = ([x, y]: [number, number]) => {
      const below: [number, number] = [x, y + 1]
      return this.checkEnv(below) ? null : below
    }

    const slide = ([x, y]: [number, number], left: boolean = true) => {
      const diag: [number, number] = left ? [x - 1, y + 1] : [x + 1, y + 1]
      return this.checkEnv(diag) ? null : diag
    }

    const move = (pos: [number, number]) => {
      return fall(pos) || slide(pos) || slide(pos, false)
    }

    let nxtMove = move(sand)

    while (nxtMove) {
      if (!canCollide(nxtMove)) {
        console.log('cant collide')
        console.log(nxtMove)
        return undefined
      }
      sand = nxtMove
      nxtMove = move(sand)
    }

    return sand
  }

  run() {
    const origin = [500, 0] as [number, number]
    let sand = this.moveSand([...origin])

    while (sand) {
      this.addSand(sand)

      sand = this.moveSand([...origin])
    }
  }

  runWithFloor() {
    const origin = [500, 0] as [number, number]
    let sand = this.moveSand([...origin])

    const isOrigin = (sand: [number, number]) => {
      return sand.toString() === origin.toString()
    }

    while (sand && !isOrigin(sand)) {
      this.addSand(sand)

      sand = this.moveSand([...origin])
    }

    //this.addSand(origin)
  }

  addSand([x, y]: [number, number]) {
    if (!this.env.has(x)) {
      this.env.set(x, new Map<number, string>())
    }

    this.env.get(x)!.set(y, 'sand')
  }

  get sandCount() {
    let count = 0
    for (const yMap of this.env.values()) {
      count += [...yMap.values()].filter((objType) => objType === 'sand').length
    }

    return count
  }

  print() {
    const min = Math.min(...this.env.keys())
    const max = Math.max(...this.env.keys())
    const depth = this.height
    const grid: string[] = []

    for (let y = 0; y <= depth; y++) {
      const row: string[] = []
      for (let x = min - 2; x <= max + 2; x++) {
        const type = this.env.get(x)?.get(y)
        if (y === this.floor || type === 'rock') {
          row.push('#')
        } else if (type === 'sand') {
          row.push('o')
        } else {
          row.push('.')
        }
      }

      grid.push(row.join(''))
    }

    console.log(grid.join('\n'))
  }
}

class D14 extends Solver {
  constructor() {
    super(2022, 14)
  }

  getRocks(input: string[] = this.getTestInput()) {
    const getPoints = (p1: [number, number], p2: [number, number]) => {
      let xs: number[]
      let ys: number[]
      if (p1[0] === p2[0]) {
        const diff = Math.abs(p1[1] - p2[1]) + 1
        xs = Array(diff).fill(p1[0])
        ys = Array(diff)
          .fill(0)
          .map((_, i) => Math.min(p1[1], p2[1]) + i)
      } else {
        const diff = Math.abs(p1[0] - p2[0])
        xs = Array(diff)
          .fill(0)
          .map((_, i) => Math.min(p1[0], p2[0]) + i)
        ys = Array(diff).fill(p1[1])
      }

      return xs.map((x, i) => [x, ys[i]] as [number, number])
    }

    const rocks: [number, number][] = []

    for (const coords of input) {
      const points = coords
        .split(' -> ')
        .map((c) => c.split(',').map((v) => Number(v))) as [number, number][]

      let p1 = points.shift()
      let p2: [number, number] | undefined = points[0]

      while (p1 && p2) {
        rocks.push(...getPoints(p1, p2))
        p1 = p2
        p2 = points.shift()
      }
    }

    return rocks
  }

  partOne(): string | number {
    const rocks = this.getRocks(this.getInput())
    const sim = new SandSim(rocks)

    sim.run()

    //sim.print()

    return sim.sandCount
  }

  partTwo(): string | number {
    const rocks = this.getRocks(this.getInput())
    const sim = new SandSim(rocks, true)

    //console.log(sim.floor)

    sim.runWithFloor()

    sim.print()

    return sim.sandCount
  }
}

export default D14
