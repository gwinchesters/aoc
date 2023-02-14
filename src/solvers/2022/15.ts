import Solver from '../base'

interface Sensor {
  pos: [number, number]
  beacon: [number, number]
  coverage: number
  mapBounds: (yPlane: number) => [number, number] | null
  canCover: ([x, y]: [number, number]) => boolean
}

const buildSensor = (input: string): Sensor => {
  const coords = input.match(
    /Sensor at x=(\d+), y=(\d+): closest beacon is at x=(-?\d+), y=(\d+)/,
  )

  const [sx, sy, bx, by] = coords?.slice(1, 5).map(Number) || []

  const mDistance = Math.abs(sx - bx) + Math.abs(sy - by)

  const mapBounds = (yPlane: number): [number, number] | null => {
    const coverageAfterY = mDistance - Math.abs(sy - yPlane)

    if (coverageAfterY < 0) {
      return null
    }

    return [sx - coverageAfterY, sx + coverageAfterY]
  }

  const calcMDistance = (
    [x1, y1]: [number, number],
    [x2, y2]: [number, number],
  ): number => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
  }

  const coverage = calcMDistance([sx, sy], [bx, by])

  const canCover = ([x, y]: [number, number]): boolean => {
    return calcMDistance([sx, sy], [x, y]) <= coverage
  }

  return {
    pos: [sx, sy],
    beacon: [bx, by],
    coverage: calcMDistance([sx, sy], [bx, by]),
    mapBounds,
    canCover,
  }
}

class D15 extends Solver {
  constructor() {
    super(2022, 15)
  }

  createSensors(input: string[] = this.getTestInput()): Sensor[] {
    return input.map(buildSensor)
  }

  findBounds(sensors: Sensor[], yPlane: number): [number, number] {
    let minX = Number.MAX_VALUE
    let maxX = Number.MIN_VALUE

    sensors.forEach((s) => {
      const bounds = s.mapBounds(yPlane)

      if (bounds) {
        const [min, max] = bounds

        if (min < minX) {
          minX = min
        }

        if (max > maxX) {
          maxX = max
        }
      }
    })

    return [minX, maxX]
  }

  partOne(): string | number {
    const sensors = this.createSensors()
    const beacons = sensors.map((s) => s.beacon.toString())

    const isBeacon = (coord: [number, number]) => {
      return beacons.includes(coord.toString())
    }

    const yPlane = 10
    const [min, max] = this.findBounds(sensors, yPlane)
    let yCoverage = 0

    for (let x = min; x <= max; x++) {
      if (
        !isBeacon([x, yPlane]) &&
        sensors.find((s) => s.canCover([x, yPlane]))
      ) {
        yCoverage += 1
      }
    }

    return yCoverage
  }

  // async testMultiThread(): Promise<[number, number] | null> {

  //   setT
  // }

  partTwo(): string | number {
    const max = 10000
    const sensors = this.createSensors(this.getInput())
    const beacons = sensors.map((s) => s.beacon.toString())

    const isBeacon = (coord: [number, number]) => {
      return beacons.includes(coord.toString())
    }
    let tuningFreq = 0

    const start = Date.now()

    for (let x = 0; x <= max; x++) {
      for (let y = 0; y <= max; y++) {
        if (!isBeacon([x, y]) && !sensors.find((s) => s.canCover([x, y]))) {
          console.log(x, y)
          tuningFreq = 4000000 * x + y
          break
        }
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(2)

    console.log(elapsed)

    return tuningFreq
  }
}

export default D15
