import Solver from '../common/base'

type Play = 'R' | 'P' | 'S'

export default class D2 extends Solver {
  playMap: {
    [p: string]: [Play, Play, Play, number]
  } = {
    ['R']: ['S', 'P', 'R', 1],
    ['P']: ['R', 'S', 'P', 2],
    ['S']: ['P', 'R', 'S', 3],
  }
  constructor() {
    super(2022, 2)
  }

  parseRounds(input = this.getTestInput()) {
    return input.map((r) => r.split(' ')) as [string, string][]
  }

  scoreRound([opp, my]: [Play, Play]) {
    const myPlay = this.playMap[my]
    const outcome = (() => {
      switch (myPlay.indexOf(opp)) {
        case 0:
          return 6
        case 1:
          return 0
        case 2:
          return 3
        default:
          return 0
      }
    })()
    return outcome + myPlay[3]
  }

  decodeRound(
    [opp, my]: [string, string],
    stratDecoder: (pr: [string, Play]) => string,
  ) {
    const oppPlay = (() => {
      switch (opp) {
        case 'A':
          return 'R'
        case 'B':
          return 'P'
        case 'C':
        default:
          return 'S'
      }
    })()

    const myPlay = stratDecoder([my, oppPlay])

    return [oppPlay, myPlay] as [Play, Play]
  }

  partOne(): string | number {
    const stratDecoder = ([myPlay]: [string, Play]) => {
      switch (myPlay) {
        case 'X':
          return 'R'
        case 'Y':
          return 'P'
        case 'Z':
        default:
          return 'S'
      }
    }

    return this.parseRounds(this.getInput()).reduce((totalScore, r) => {
      const decodedRound = this.decodeRound(r, stratDecoder)
      return totalScore + this.scoreRound(decodedRound)
    }, 0)
  }

  partTwo(): string | number {
    const stratDecoder = ([my, opp]: [string, Play]) => {
      const oppPlay = this.playMap[opp]
      switch (my) {
        case 'X':
          return oppPlay[0]
        case 'Y':
          return oppPlay[2]
        case 'Z':
        default:
          return oppPlay[1]
      }
    }
    return this.parseRounds(this.getInput()).reduce((totalScore, r) => {
      const decodedRound = this.decodeRound(r, stratDecoder)
      return totalScore + this.scoreRound(decodedRound)
    }, 0)
  }
}
