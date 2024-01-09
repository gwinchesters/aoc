import Solver from '../common/base'

interface NestedList<T> extends Array<number | NestedList<T>> {}

type Packet = NestedList<number>

interface PacketPair {
  left: Packet
  right: Packet
}

type ArrayElement<T> = T extends (infer U)[] ? U : null

const assertNumber = (
  element: ArrayElement<NestedList<number>> | undefined,
): element is number => {
  return typeof element === 'number'
}

/**
 *
 * @param packet
 * @param otherPacket
 * @returns packet < other: -1, packet > other: 1
 */
const comparePackets = (
  packet: Packet,
  otherPacket: Packet,
): number | undefined => {
  let p = packet[0]
  let o = otherPacket[0]

  if (p === undefined && o === undefined) {
    return
  }

  if (p === undefined) {
    return -1
  }

  if (o === undefined) {
    return 1
  }

  if (assertNumber(p) && assertNumber(o)) {
    if (p < o) {
      return -1
    } else if (p > o) {
      return 1
    }

    return comparePackets(packet.slice(1), otherPacket.slice(1))
  }

  if (assertNumber(p)) {
    p = [p]
  }

  if (assertNumber(o)) {
    o = [o]
  }

  return (
    comparePackets(p, o) ??
    comparePackets(packet.slice(1), otherPacket.slice(1))
  )
}

class D13 extends Solver {
  constructor() {
    super(2022, 13)
  }

  getPacketPairs(input: string[] = this.getTestInput()): PacketPair[] {
    const packetPairs: PacketPair[] = []

    while (input.length > 0) {
      const [left, right] = input.splice(0, 3)

      packetPairs.push({
        left: JSON.parse(left),
        right: JSON.parse(right),
      })
    }

    return packetPairs
  }

  getPackets(input: string[] = this.getTestInput()): Packet[] {
    return input.reduce<Packet[]>((acc, rawPacket) => {
      if (rawPacket.length === 0) {
        return acc
      }
      return [...acc, JSON.parse(rawPacket)]
    }, [])
  }

  partOne(): string | number {
    const packetPairs = this.getPacketPairs(this.getInput())

    return packetPairs.reduce((acc, pair, i) => {
      const { left, right } = pair
      return acc + (comparePackets(left, right) === -1 ? i + 1 : 0)
    }, 0)
  }

  partTwo(): string | number {
    const dividerPackets = [[[2]], [[6]]]
    const packets = [...this.getPackets(this.getInput()), ...dividerPackets]

    packets.sort((a, b) => {
      return comparePackets(a, b) ?? 0
    })

    return packets.reduce((acc, p, i) => {
      return dividerPackets
        .map((p) => JSON.stringify(p))
        .includes(JSON.stringify(p))
        ? acc * (i + 1)
        : acc
    }, 1)
  }
}

export default D13
