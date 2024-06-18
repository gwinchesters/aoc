import { readFileSync } from 'fs'
import { resolve } from 'path'

export const parseInput = (file: string): string[] => {
  const input = readFileSync(resolve(__dirname, `../input/${file}.txt`), 'utf8')

  return input.split('\n')
}
