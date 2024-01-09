import Solver from './common/base'

const getSolver = async (year: number, day: number): Promise<Solver> => {
  return new (await import(`./${year}/${day}`)).default()
}

;(async () => {
  const [year, day] = process.argv.slice(2).map(Number)

  const solver = await getSolver(year, day)

  console.log(`${solver.name} (part 1): ${solver.partOne()}`)
  console.log(`${solver.name} (part 2): ${solver.partTwo()}`)
})()
