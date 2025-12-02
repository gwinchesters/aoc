import Solver from './common/base'

const getSolver = async (year: number, day: number): Promise<Solver> => {
  return new (await import(`./${year}/${day}`)).default()
}

;(async () => {
  const [year, day, part] = process.argv.slice(2).map(Number)

  const solver = await getSolver(year, day)

  if (!part || part == 1) {
    console.log(`${solver.name} (part 1): ${solver.partOne()}`)
  }

  if (!part || part == 2) {
    console.log(`${solver.name} (part 2): ${solver.partTwo()}`)
  }
})()
