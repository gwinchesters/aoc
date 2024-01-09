import { generateSeries } from '../utils/series'
import Solver from '../common/base'

interface Card {
  id: number
  winNums: number[]
  myNums: number[]
}

export default class D4 extends Solver {
  constructor() {
    super(2023, 4)
  }

  parseCards(input = this.getInput()) {
    return input.map((i) => {
      const m = i.match(/Card\s+(?<id>\d+)\: (?<winNums>.*) \| (?<myNums>.*)/)

      if (m?.groups) {
        const { id, winNums, myNums } = m.groups

        return {
          id: Number(id),
          winNums: winNums.split(/\s+/).map(Number),
          myNums: myNums.split(/\s+/).map(Number),
        } as Card
      }
      return {} as Card
    })
  }

  partOne(): string | number {
    const cards = this.parseCards()

    return cards.reduce((t, { winNums, myNums }) => {
      const pow = myNums.filter((n) => winNums.includes(n)).length - 1

      return pow >= 0 ? t + Math.pow(2, pow) : t
    }, 0)
  }

  partTwo(): string | number {
    type CopyMap = {
      [id: number]: {
        copies: number[]
        totalCopies: number | null
      }
    }
    const cards = this.parseCards()

    const copyMap = {} as CopyMap

    for (const { id, winNums, myNums } of cards) {
      const winCount = myNums.filter((n) => winNums.includes(n)).length

      const copies = winCount > 0 ? generateSeries(id + 1, id + winCount) : []

      copyMap[id] = {
        copies,
        totalCopies: null,
      }
    }

    const countCopies = (copyMap: CopyMap, id: number): number => {
      const { copies, totalCopies } = copyMap[id]
      if (!copies || !copies.length || totalCopies) {
        return totalCopies ?? 1
      }

      return copyMap[id].copies.reduce((t, copyId) => {
        return t + countCopies(copyMap, copyId)
      }, 1)
    }

    cards.sort((a, b) => b.id - a.id)

    return cards.reduce((t, { id }) => {
      const totalCopies = countCopies(copyMap, id)
      copyMap[id].totalCopies = totalCopies

      return t + totalCopies
    }, 0)
  }
}
