import Solver from '../common/base'

class Valve {
  id: string
  flowRate: number
  tunnels: string[]

  constructor(id: string, flowRate: number, tunnels: string[]) {
    this.id = id
    this.flowRate = flowRate
    this.tunnels = tunnels
  }
}

const parseValve = (input: string): Valve => {
  const valve = input.match(
    /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/,
  )

  if (!valve) {
    throw Error('Could not parse valve')
  }

  const id = valve[1]
  const flowRate = Number(valve[2])
  const tunnels = valve[3].split(',').map((t) => t.trim())

  return new Valve(id, flowRate, tunnels)
}

class ValveReport {
  valveMap: { [id: string]: Valve }

  constructor(valveMap: { [id: string]: Valve }) {
    this.valveMap = valveMap
  }

  getConnectedValves(valveId: string): Valve[] {
    return this.valveMap[valveId].tunnels.map((t) => this.valveMap[t])
  }

  getFlowRate(valveId: string) {
    return this.valveMap[valveId].flowRate
  }

  getPotentialPressure(valveId: string, minute: number) {
    return this.valveMap[valveId].flowRate * (30 - minute)
  }
}

type QNode = {
  valveId: string
  minute: number
  openValves: string[]
  path: string[]
  ppm: number
}

class PathFinder {
  static bfs(report: ValveReport) {
    const queue: QNode[] = [
      {
        valveId: 'AA',
        minute: 0,
        openValves: [],
        path: ['AA'],
        ppm: 0,
      },
    ]
    const seen = new Set<string>()
    const valveCosts = new Map<string, QNode>()

    const betterPath = (node: QNode) => {
      const current = valveCosts.get(node.valveId)
    }

    while (queue.length > 0) {
      const node = queue.shift()!

      if (seen.has(node.valveId)) {
        continue
      }

      const pp = report.getPotentialPressure(node.valveId, node.minute + 1)

      if (pp > 0) {
        node.minute += 1
        node.openValves.push(node.valveId)
        node.ppm += report.getFlowRate(node.valveId)
      }

      for (const adjValve of report.getConnectedValves(node.valveId)) {
      }

      seen.add(node.valveId)

      if (!valveCosts.has(node.valveId)) {
        valveCosts.set(node.valveId, node)
      } else if (valveCosts.get(node.valveId)) {
      }
    }
  }
}

class D16 extends Solver {
  constructor() {
    super(2022, 16)
  }

  buildValves(input: string[] = this.getTestInput()) {
    return input
      .map(parseValve)
      .reduce((acc, valve) => ({ ...acc, [valve.id]: valve }), {}) as {
      [id: string]: Valve
    }
  }

  partOne(): string | number {
    const valveMap = this.buildValves()
    return ''
  }
  partTwo(): string | number {
    return ''
  }
}

export default D16
