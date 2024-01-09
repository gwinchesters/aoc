import Solver from '../common/base'

type Position = [number, number]

interface Tile {
  pos: Position
  value: string
  connections: [Position, Position] | []
  distance?: number
  explored: boolean
  isEnclosed?: boolean
}

type TileMap = Map<number, Map<number, Tile>>

export default class D10 extends Solver {
  constructor() {
    super(2023, 10)
  }

  getConnections(value: string, [r, c]: Position): Tile['connections'] {
    switch (value) {
      case '|':
        return [
          [r - 1, c],
          [r + 1, c],
        ]
      case '-':
        return [
          [r, c - 1],
          [r, c + 1],
        ]
      case 'L':
        return [
          [r - 1, c],
          [r, c + 1],
        ]
      case 'J':
        return [
          [r, c - 1],
          [r - 1, c],
        ]
      case '7':
        return [
          [r, c - 1],
          [r + 1, c],
        ]
      case 'F':
        return [
          [r + 1, c],
          [r, c + 1],
        ]
      case '.':
      default:
        return []
    }
  }

  isConnected(tileMap: TileMap, tilePos: Position, pos: Position) {
    return tileMap
      .get(tilePos[0])
      ?.get(tilePos[1])
      ?.connections.some(([r, c]) => r === pos[0] && c === pos[1])
  }

  parsePipeMap(input = this.getInput()) {
    const tiles: TileMap = new Map<number, Map<number, Tile>>()
    let start = [0, 0] as Position

    for (const [r, row] of input.entries()) {
      if (!tiles.has(r)) {
        tiles.set(r, new Map<number, Tile>())
      }
      for (const [c, col] of row.split('').entries()) {
        const pos = [r, c] as Position

        if (col === 'S') {
          start = pos
        }

        const tile = {
          pos: pos,
          value: col,
          connections: this.getConnections(col, pos),
          explored: false,
        } as Tile

        tiles.get(r)!.set(c, tile)
      }
    }

    const [r, c] = start

    const hasNorth = this.isConnected(tiles, [r - 1, c], start)
    const hasEast = this.isConnected(tiles, [r, c + 1], start)
    const hasSouth = this.isConnected(tiles, [r + 1, c], start)
    const hasWest = this.isConnected(tiles, [r, c - 1], start)

    if (hasNorth && hasSouth) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('|', [r, c])
    } else if (hasEast && hasWest) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('-', [r, c])
    } else if (hasNorth && hasEast) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('L', [r, c])
    } else if (hasNorth && hasWest) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('J', [r, c])
    } else if (hasSouth && hasWest) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('7', [r, c])
    } else if (hasSouth && hasEast) {
      tiles.get(r)!.get(c)!.connections = this.getConnections('F', [r, c])
    }

    return {
      tileMap: tiles,
      start,
    }
  }

  printMap(tileMap: TileMap) {
    const map = []

    for (const row of tileMap.values()) {
      const r = []
      for (const col of row.values()) {
        const display = col.isEnclosed === false ? '0' : col.value
        r.push(display)
      }

      map.push(r.join(''))
    }

    console.log(map.join('\n'))
  }

  exploreTiles(tileMap: TileMap, start: Position) {
    const startTile = tileMap.get(start[0])!.get(start[1])!

    startTile.explored = true
    startTile.distance = 0

    const toExplore = [...startTile.connections]

    while (toExplore.length) {
      const pos = toExplore.shift()

      if (pos) {
        const tile = tileMap.get(pos[0])!.get(pos[1])!

        const connectedTiles = tile.connections.map(([r, c]) => {
          return tileMap.get(r)!.get(c)!
        })

        for (const t of connectedTiles) {
          if (t.explored) {
            if (t.distance === undefined) {
              console.log('Explored Tile with no distance')
            } else {
              tile.explored = true
              tile.distance = t.distance + 1
            }
          } else {
            toExplore.push(t.pos)
          }
        }
      }
    }
  }

  checkIfAdjEnclosed(
    tileMap: TileMap,
    [r, c]: Position,
    blackListAdj = [] as string[],
  ) {
    const adjPoints: { [direction: string]: Position } = {
      N: [r - 1, c],
      E: [r, c + 1],
      S: [r + 1, c],
      W: [r, c - 1],
    }

    const a = Object.entries(adjPoints).reduce((filteredAdj, [key, pos]) => {
      if (!blackListAdj.includes(key)) {
        return [...filteredAdj, pos]
      }

      return filteredAdj
    }, [] as Position[])

    return a.some((adjPos) => {
      const adjTile = tileMap.get(adjPos[0])?.get(adjPos[1])

      return !adjTile || adjTile?.isEnclosed === false
    })
  }

  setDefaultEnclosed(tileMap: TileMap) {
    let updated = true

    while (updated) {
      updated = false

      for (const row of tileMap.values()) {
        for (const tile of row.values()) {
          if (
            tile.isEnclosed === undefined &&
            tile.value === '.' &&
            this.checkIfAdjEnclosed(tileMap, tile.pos)
          ) {
            tile.isEnclosed = false
            updated = true
          }
        }
      }
    }
  }

  partOne(): string | number {
    const { tileMap, start } = this.parsePipeMap()

    this.exploreTiles(tileMap, start)

    const tiles = [...tileMap.values()].reduce((tileList, row) => {
      return [...tileList, ...[...row.values()]]
    }, [] as Tile[])

    const furthestDistance = tiles.reduce((maxDistance, { distance }) => {
      return distance && distance > maxDistance ? distance : maxDistance
    }, 0)

    return furthestDistance
  }

  partTwo(): string | number {
    const { tileMap, start } = this.parsePipeMap()

    this.exploreTiles(tileMap, start)

    for (const row of tileMap.values()) {
      for (const tile of row.values()) {
        if (tile.distance === undefined) {
          tile.value = '.'
          tile.connections = []
        }

        if (tile.value === '.' && this.checkIfAdjEnclosed(tileMap, tile.pos)) {
          tile.isEnclosed = false
        }
      }
    }

    this.setDefaultEnclosed(tileMap)

    return ''
  }
}
