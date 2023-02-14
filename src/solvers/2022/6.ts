import Solver from '../base'

class D6 extends Solver {
  constructor() {
    super(2022, 6)
  }

  checkBuffer(buffer: string, len: number): number {
    const bufArr = buffer.split('')

    let markerPosition = 0

    for (let i = len - 1; i <= bufArr.length; i++) {
      const marker = bufArr.slice(i - len, i)

      const markerSet = new Set(marker)

      if (markerSet.size === len) {
        markerPosition = i

        break
      }
    }

    return markerPosition
  }

  partOne(): string | number {
    const input = this.getInput()

    return this.checkBuffer(input[0], 4)
  }
  partTwo(): string | number {
    const input = this.getInput()
    return this.checkBuffer(input[0], 14)
  }
}

export default D6
