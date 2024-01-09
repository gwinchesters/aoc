import Solver from '../common/base'

export default class D2 extends Solver {
  constructor() {
    super(2023, 2)
  }

  parseGame(game: string) {
    const [meta, reveals] = game.split(':')

    const cubes = reveals.split(';').map((r) => {
      return [
        ...r.matchAll(/(?<numCubes>\d+)\s(?<color>red|green|blue)/g),
      ].reduce((acc, m) => {
        if (m.groups) {
          return {
            ...acc,
            [m.groups.color]: Number(m.groups.numCubes ?? 0),
          }
        }
        return acc
      }, {} as { [color: string]: number })
    })

    return {
      id: Number(meta.split(' ')[1]),
      cubes,
    }
  }

  partOne(): string | number {
    const games = this.getInput().map(this.parseGame)
    return games.reduce((totalValidIds, game) => {
      const isValid = game.cubes.every((countByColor) => {
        return (
          (countByColor['red'] ?? 0) <= 12 &&
          (countByColor['green'] ?? 0) <= 13 &&
          (countByColor['blue'] ?? 0) <= 14
        )
      })

      return isValid ? totalValidIds + game.id : totalValidIds
    }, 0)
  }

  partTwo(): string | number {
    const games = this.getInput().map(this.parseGame)
    return games.reduce((totalPowers, game) => {
      const { red, green, blue } = game.cubes.reduce(
        (maxCounts, countByColor) => {
          if (countByColor['red'] > (maxCounts['red'] ?? 0)) {
            maxCounts['red'] = countByColor['red']
          }
          if (countByColor['green'] > (maxCounts['green'] ?? 0)) {
            maxCounts['green'] = countByColor['green']
          }
          if (countByColor['blue'] > (maxCounts['blue'] ?? 0)) {
            maxCounts['blue'] = countByColor['blue']
          }
          return maxCounts
        },
        {} as { [color: string]: number },
      )

      return totalPowers + red * green * blue
    }, 0)
  }
}
