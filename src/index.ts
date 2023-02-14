import getSolver from './solvers'
;(async () => {
  const [year, day] = process.argv.slice(2).map(Number)

  const solver = await getSolver(year, day)

  console.log(`${solver.name} (part 1): ${solver.partOne()}`)
  console.log(`${solver.name} (part 2): ${solver.partTwo()}`)
})()
