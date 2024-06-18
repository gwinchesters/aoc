import { Tup } from '../utils/type'
import Solver from '../common/base'

type Node = Tup<number>

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
  const lstThreeNodes = path.slice(-4)

  if (lstThreeNodes.length != 4) {
    return true
  }

  const [nr, nc] = adj
  const sameRow = lstThreeNodes.every(([r]) => r == nr)
  const sameCol = lstThreeNodes.every(([_, c]) => c == nc)

  if (sameRow || sameCol) {
    return false
  }

  return true
}

interface SearchNode {
  node: Node
  cost: number
  path: Node[]
}

function dijkstra(graph: Graph, source: Node, goal: Node): SearchNode {
  const distances = nodeMap<SearchNode>({
    node: [-1, -1],
    cost: Number.POSITIVE_INFINITY,
    path: [],
  })
  const visited = nodeMap(false)
  const q = priorityQueue<SearchNode>()
  q.insert({ node: source, cost: 0, path: [source] }, 0)
  distances.add(source, {
    node: source,
    cost: 0,
    path: [source],
  })

  while (!q.isEmpty()) {
    const { node, cost, path } = q.pop()!

    if (visited.has(node)) continue
    visited.add(node, true)

    for (const adjNode of graph.getAdj(node)) {
      if (!adjIsReachable(path, adjNode)) continue

      if (cost + graph.getNode(adjNode) < distances.get(adjNode).cost) {
        const searchNode = {
          node: adjNode,
          cost: cost + graph.getNode(adjNode),
          path: [...path, adjNode],
        }

        distances.add(adjNode, searchNode)

        q.insert(searchNode, cost + graph.getNode(adjNode))
      }
    }
  }

  if (distances.has(goal)) {
    const { cost, path } = distances.get(goal)

    graph.printPath(path)

    console.log(cost)
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
