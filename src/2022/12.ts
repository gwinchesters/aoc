import Solver from '../common/base'

type Coordinate = [number, number]

class HeightGraph {
  grid: string[][]

  constructor(grid: string[][]) {
    this.grid = grid
  }

  print(path: Coordinate[] = []) {
    const paths = path.map((c) => c.toString())
    const output: string[][] = []

    for (const x of this.grid.keys()) {
      for (const y of this.grid[x].keys()) {
        const display = paths.includes([x, y].toString())
          ? '.'
          : this.grid[x]?.[y]
        output[y] = output[y] || []
        output[y][x] = display
      }
    }

    console.log(output.map((row) => row.join('')).join('\n'))
  }

  getElevation([x, y]: Coordinate) {
    return this.grid[x]?.[y]
  }

  getCoordinates(elevation: string): Coordinate[] {
    const coordinates = []
    for (const x of this.grid.keys()) {
      for (const y of this.grid[x].keys()) {
        if (this.grid[x][y] === elevation) {
          coordinates.push([x, y] as Coordinate)
        }
      }
    }

    return coordinates
  }

  getHeight(coordinate: Coordinate) {
    const elevationHeights = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const elevation = this.getElevation(coordinate)

    switch (elevation) {
      case 'S':
        return elevationHeights.indexOf('a')
      case 'E':
        return elevationHeights.indexOf('z')
      default:
        return elevationHeights.indexOf(elevation)
    }
  }

  getAdjacent(coordinate: Coordinate) {
    const [x, y] = coordinate

    const canMove = (target: Coordinate) => {
      const originHeight = this.getHeight(coordinate)
      const targetHeight = this.getHeight(target)

      return targetHeight - originHeight <= 1
    }

    const adjCoordinates: Coordinate[] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]

    return adjCoordinates.filter(
      (t) => Boolean(this.getElevation(t)) && canMove(t),
    )
  }
}

class PathFinder {
  static bfs(
    graph: HeightGraph,
    start: string = 'S',
    end: string = 'E',
  ): { coordinate: Coordinate; cost: number; path: Coordinate[] } {
    const queue = graph
      .getCoordinates(start)
      .map((coordinate) => ({ coordinate, cost: 0, path: [coordinate] }))
    const seen = new Map<number, Set<number>>()

    while (graph.getElevation(queue[0].coordinate) !== end) {
      const { coordinate, cost, path } = queue.shift()!
      const [x, y] = coordinate

      if (seen.get(x)?.has(y)) {
        continue
      }

      if (!seen.has(x)) {
        seen.set(x, new Set())
      }

      for (const adjCoordinate of graph.getAdjacent(coordinate)) {
        queue.push({
          coordinate: adjCoordinate,
          cost: cost + 1,
          path: [...path, adjCoordinate],
        })
      }

      seen.get(x)!.add(y)
    }

    return queue[0]
  }
}

class D12 extends Solver {
  constructor() {
    super(2022, 12)
  }

  buildGrid(input: string[] = this.getInput()) {
    return input.reduce<string[][]>((acc, row, y) => {
      return row.split('').reduce<string[][]>((acc, ele, x) => {
        acc[x] = acc[x] || []
        acc[x][y] = ele
        return acc
      }, acc)
    }, [])
  }

  partOne(): string | number {
    const graph = new HeightGraph(this.buildGrid(this.getTestInput()))

    const { cost, path } = PathFinder.bfs(graph)

    graph.print(path)

    return cost
  }

  partTwo(): string | number {
    const graph = new HeightGraph(this.buildGrid(this.getInput()))

    const { cost, path } = PathFinder.bfs(graph, 'a', 'E')

    graph.print(path)

    return cost
  }
}

export default D12
