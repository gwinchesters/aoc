import { Tup } from '../utils/type'
import Solver from '../common/base'

type Node = Tup<number>
// type DoT = 'N' | 'S' | 'E' | 'W'

class Graph {
  nodes: number[][]

  constructor(nodes: number[][]) {
    this.nodes = nodes
  }

  getNode([r, c]: Node): number {
    return this.nodes[r]?.[c]
  }

  getAdj([r, c]: Node): Node[] {
    const adjNodes: Node[] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]

    if (Math.random() > 0.5) {
      adjNodes.reverse()
    }

    return adjNodes.filter((n) => Boolean(this.getNode(n)))
  }

  printPath(path: Node[]) {
    const copy = [...this.nodes].map((r) => r.map(String))

    path.forEach(([r, c], i) => {
      if (path[i - 1]) {
        const [pr, pc] = path[i - 1]

        if (pr < r) {
          copy[r][c] = 'V'
        }

        if (pr > r) {
          copy[r][c] = '^'
        }

        if (pc < c) {
          copy[r][c] = '>'
        }

        if (pc > c) {
          copy[r][c] = '<'
        }
      }
    })

    console.log(copy.map((r) => r.join('')).join('\n'))
  }
}

interface PriorityQueue<T> {
  insert(item: T, priority: number): void
  pop(): T | null
  peek(): T | null
  isEmpty(): boolean
  print(): void
}

interface HeapNode<T> {
  key: number
  value: T
}

const priorityQueue = <T>(): PriorityQueue<T> => {
  const heap: HeapNode<T>[] = []

  const parent = (i: number) => Math.floor((i - 1) / 2)
  const left = (i: number) => 2 * i + 1
  const right = (i: number) => 2 * i + 2
  const hasLeft = (i: number) => left(i) < heap.length
  const hasRight = (i: number) => right(i) < heap.length
  const swap = (a: number, b: number) => {
    const aNode = heap[a]
    heap[a] = heap[b]
    heap[b] = aNode
  }

  return {
    insert: (item, priority) => {
      heap.push({ key: priority, value: item })

      let i = heap.length - 1
      while (i > 0) {
        const p = parent(i)
        if (heap[p].key < heap[i].key) break
        swap(i, p)
        i = p
      }
    },
    pop: () => {
      if (heap.length == 0) return null

      swap(0, heap.length - 1)
      const item = heap.pop()!

      let current = 0
      while (hasLeft(current)) {
        let smallerChild = left(current)
        if (
          hasRight(current) &&
          heap[right(current)].key < heap[left(current)].key
        ) {
          smallerChild = right(current)
        }

        if (heap[smallerChild].key > heap[current].key) break

        swap(current, smallerChild)
        current = smallerChild
      }

      return item?.value
    },
    peek: () => (heap.length == 0 ? null : heap[0].value),
    isEmpty: () => heap.length == 0,
    print: () => console.log(heap),
  }
}

interface NodeMap<T> {
  add: (node: Node, value: T) => void
  get: (node: Node) => T
  has: (node: Node) => boolean
}

const nodeMap = <T>(defaultNotFound: T): NodeMap<T> => {
  const map = new Map<number, Map<number, T>>()

  return {
    add: ([r, c], value) => {
      if (!map.has(r)) {
        map.set(r, new Map<number, T>())
      }

      map.get(r)!.set(c, value)
    },
    get: ([r, c]) => {
      if (!map.has(r)) {
        return defaultNotFound
      }

      return map.get(r)!.get(c) ?? defaultNotFound
    },
    has: ([r, c]) => {
      if (!map.has(r)) {
        return false
      }

      return Boolean(map.get(r)!.get(c))
    },
  }
}

const adjIsReachable = (path: Node[], adj: Node) => {
  // 180 degree turn
  if (path.slice(-1)[0] == adj) return false

  // All adj nodes are valid
  if (path.length <= 3) return true

  type DoT = 'N' | 'S' | 'E' | 'W'
  const getDoT = ([aR, aC]: Node, [bR, bC]: Node): DoT => {
    if (aR == bR && aC < bC) return 'E'
    else if (aR == bR && aC > bC) return 'W'
    else if (aR < bR && aC == bC) return 'S'
    else return 'N'
  }

  const dot = getDoT(path.slice(-2)[0], path.slice(-2)[1])
  const dotAdj = getDoT(path.slice(-1)[0], adj)

  // 90 degree turn left or right
  if (['N', 'S'].includes(dot) && ['E', 'W'].includes(dotAdj)) return true

  // 90 degree turn up or down
  if (['E', 'W'].includes(dot) && ['N', 'S'].includes(dotAdj)) return true

  return !path
    .slice(-4)
    .reduce<DoT[]>((acc, node, i, moves) => {
      if (!moves[i + 1]) return acc

      return [...acc, getDoT(node, moves[i + 1])]
    }, [])
    .every((prevDot) => prevDot == dot)
}

type DoT = 'N' | 'S' | 'E' | 'W'
const getDoT = ([aR, aC]: Node, [bR, bC]: Node): DoT => {
  if (aR == bR && aC < bC) return 'E'
  else if (aR == bR && aC > bC) return 'W'
  else if (aR < bR && aC == bC) return 'S'
  else return 'N'
}

const visitedNodes = () => {
  const visited = new Map<string, Set<DoT | null>>()

  const toKey = ([r, c]: Node) => `${r}_${c}`

  return {
    seen: (node: Node, dot: DoT | null) => {
      const key = toKey(node)
      if (!visited.has(key)) return false

      return visited.get(key)!.has(dot)
    },
    add: (node: Node, dot: DoT | null) => {
      const key = toKey(node)
      if (!visited.has(key)) visited.set(key, new Set<DoT>())

      visited.get(key)!.add(dot)
    },
  }
}

const distanceMap = () => {
  const d = new Map<string, SearchNode>()
  const toKey = ([r, c]: Node, dot: DoT | null) => `${r}_${c}_${dot}`

  return {
    get: (node: Node, dot: DoT | null) => {
      const key = toKey(node, dot)
      if (!d.has(key)) return null

      return d.get(key)
    },
    getCost: (node: Node, dot: DoT | null) => {
      const key = toKey(node, dot)
      if (!d.has(key)) return Number.POSITIVE_INFINITY

      return d.get(key)!.cost
    },
    add: (node: Node, dot: DoT | null, sn: SearchNode) => {
      d.set(toKey(node, dot), sn)
    },
  }
}

interface SearchNode {
  node: Node
  cost: number
  path: Node[]
  dot: DoT | null
}

function dijkstra(graph: Graph, source: Node, goal: Node): SearchNode {
  const distances = distanceMap()
  const visited = visitedNodes()
  const q = priorityQueue<SearchNode>()
  q.insert({ node: source, cost: 0, path: [source], dot: null }, 0)
  distances.add(source, null, {
    node: source,
    cost: 0,
    path: [source],
    dot: null,
  })

  while (!q.isEmpty()) {
    const { node, cost, path, dot } = q.pop()!

    if (visited.seen(node, dot)) continue
    visited.add(node, dot)

    for (const adjNode of graph.getAdj(node)) {
      if (!adjIsReachable(path, adjNode)) continue

      const adjDoT = getDoT(node, adjNode)

      if (cost + graph.getNode(adjNode) < distances.getCost(adjNode, adjDoT)) {
        const searchNode = {
          node: adjNode,
          cost: cost + graph.getNode(adjNode),
          path: [...path, adjNode],
          dot: getDoT(node, adjNode),
        }

        distances.add(adjNode, adjDoT, searchNode)

        q.insert(searchNode, cost + graph.getNode(adjNode))
      }
    }
  }

  if (distances.get(goal, 'E')) {
    graph.printPath(distances.get(goal, 'E')!.path)
  }

  return q.peek()!
}

export default class D17 extends Solver {
  constructor() {
    super(2023, 17)
  }

  getGraph(input = this.getTestInput()) {
    return new Graph(input.map((l) => l.split('').map(Number)))
  }

  partOne(): string | number {
    const graph = this.getGraph()

    const node = dijkstra(
      graph,
      [0, 0],
      [graph.nodes.length - 1, graph.nodes[0].length - 1],
    )

    console.log(node)

    return ''
  }

  partTwo(): string | number {
    return ''
  }
}
