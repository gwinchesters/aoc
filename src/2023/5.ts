import { Range } from '../utils/type'
import Solver from '../common/base'

interface IdMap {
  sourceRange: Range
  targetRange: Range
}

interface CategoryMap {
  source: string
  destination: string
  idMaps: IdMap[]
}

export default class D5 extends Solver {
  constructor() {
    super(2023, 5)
  }

  parseMap(input = this.getInput()) {
    const seeds = input[0].split(' ').slice(1).map(Number)

    const maps: CategoryMap[] = []
    let catMap: CategoryMap | undefined

    for (const line of input.slice(2)) {
      if (!line || line === '') {
        continue
      }

      const mapperRegex = /(?<source>.*)-to-(?<destination>.*) map:/

      if (mapperRegex.test(line)) {
        if (catMap) {
          maps.push(catMap)
        }
        const { groups } = line.match(mapperRegex) ?? {}
        if (groups) {
          catMap = {
            source: groups.source,
            destination: groups.destination,
            idMaps: [],
          } as CategoryMap
        }

        continue
      }

      // parse mappings
      const [target, source, len] = line.split(' ').map(Number)

      const sourceRange = [source, source + len - 1] as Range
      const targetRange = [target, target + len - 1] as Range

      if (catMap) {
        catMap.idMaps.push({
          sourceRange,
          targetRange,
        })
      }
    }

    if (catMap) {
      maps.push(catMap)
    }

    return {
      seeds,
      maps,
    }
  }

  findLocation(maps: CategoryMap[], id: number, sourceType: string): number {
    const { destination, idMaps } =
      maps.find((m) => m.source === sourceType) ?? ({} as CategoryMap)

    const targetId = (() => {
      const idMap = idMaps.find(({ sourceRange }) => {
        return sourceRange[0] <= id && id <= sourceRange[1]
      })

      if (idMap) {
        return idMap.targetRange[0] + (id - idMap.sourceRange[0])
      }
      return id
    })()

    if (destination === 'location') {
      return targetId
    }

    return this.findLocation(maps, targetId, destination)
  }

  partOne(): string | number {
    const { seeds, maps } = this.parseMap()

    const locations = seeds
      .map((s) => this.findLocation(maps, s, 'seed'))
      .sort((a, b) => a - b)

    return locations[0]
  }

  overlap(a: Range, b: Range): Range | null {
    const maxLB = Math.max(a[0], b[0])
    const minUB = Math.min(a[1], b[1])

    if (Math.max(0, minUB - maxLB + 1) > 0) {
      return [maxLB, minUB]
    }
    return null
  }

  mapToTarget([lb, ub]: Range, { sourceRange, targetRange }: IdMap): Range {
    const lbOffset = lb - sourceRange[0]

    const intersectionSize = ub - lb

    const targetStart = targetRange[0] + lbOffset
    const targetEnd = targetStart + intersectionSize

    return [targetStart, targetEnd]
  }

  findLocationByRange(
    maps: CategoryMap[],
    idRanges: Range[],
    sourceType: string,
  ): Range[] {
    const { destination, idMaps } =
      maps.find((m) => m.source === sourceType) ?? ({} as CategoryMap)

    type RangeMappings = {
      unmapped: Range[]
      mapped: IdMap[]
    }

    const targetRanges = idRanges.reduce((mappedRanges, range) => {
      const mappedOverlaps = idMaps.reduce(
        (mappings, m) => {
          const { unmapped, mapped } = mappings
          const unmappedSegments = []

          for (const umr of unmapped) {
            const overlap = this.overlap(umr, m.sourceRange)

            if (!overlap) {
              unmappedSegments.push(umr)
              continue
            }

            const mappedOverlap = this.mapToTarget(overlap, m)

            const unmappedHead = [umr[0], overlap[0] - 1] as Range
            const unmappedTail = [overlap[1] + 1, umr[1]] as Range

            if (unmappedHead[0] <= unmappedHead[1]) {
              unmappedSegments.push(unmappedHead)
            }

            if (unmappedTail[0] <= unmappedTail[1]) {
              unmappedSegments.push(unmappedTail)
            }

            mapped.push({
              sourceRange: overlap,
              targetRange: mappedOverlap,
            })
          }

          return {
            unmapped: unmappedSegments,
            mapped,
          }
        },
        { unmapped: [range], mapped: [] } as RangeMappings,
      )

      const unmapped = mappedOverlaps.unmapped
      const mappedToTarget = mappedOverlaps.mapped.map(
        ({ targetRange }) => targetRange,
      )

      const targetMappings = [...unmapped, ...mappedToTarget]

      return [...mappedRanges, ...targetMappings]
    }, [] as Range[])

    if (destination === 'location') {
      return targetRanges
    }

    return this.findLocationByRange(maps, targetRanges, destination)
  }

  convertToSeedRanges(seeds: number[]) {
    const seedRanges = []
    for (let i = 0; i < seeds.length; i += 2) {
      const seedRange = [seeds[i], seeds[i] + seeds[i + 1] - 1] as Range

      seedRanges.push(seedRange)
    }
    return seedRanges
  }

  partTwo(): string | number {
    const { seeds, maps } = this.parseMap()

    const seedRanges = this.convertToSeedRanges(seeds)

    const orderedLocationRanges = seedRanges
      .reduce((mappedLocations, r) => {
        return [
          ...mappedLocations,
          ...this.findLocationByRange(maps, [r], 'seed'),
        ]
      }, [] as Range[])
      .sort((a, b) => a[0] - b[1])

    return orderedLocationRanges[0][0]
  }
}
