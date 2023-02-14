import Solver from './base'

const getSolver = async (year: number, day: number): Promise<Solver> => {
  return new (await import(`./${year}/${day}`)).default()
}

export default getSolver
