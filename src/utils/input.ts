import { readFileSync } from 'fs'
import { resolve } from 'path'

export const parseInput = (year: number, file: string | number): string[] => {
  const input = readFileSync(
    resolve(__dirname, `../${year}/input/${file}.txt`),
    'utf8',
  )

  return input.split('\n')
}
