import { readFileSync } from 'fs'
import { resolve } from 'path'

export const parseInput = (file: string): string[] => {
  const input = readFileSync(resolve(__dirname, `../input/${file}.txt`), 'utf8')

  return input.split('\n')
}

export function parse<T>(
  file: string,
  splitOn: string,
  parseLine: (line: string) => T | undefined,
): T[] {
  const input = readFileSync(resolve(__dirname, `../input/${file}.txt`), 'utf8')
  const lines = input.split(splitOn)

  return lines.reduce<T[]>((acc, line) => {
    const t = parseLine(line)
    if (!t) return acc
    acc.push(t)
    return acc
  }, [] as T[])
}
