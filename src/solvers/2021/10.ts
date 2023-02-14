import Solver from '../base'

class SubAnalyzer {
  static syntaxChars: [string, string][] = [
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
  ]

  static checkLine(line: string) {
    console.log(line)
    return this.syntaxChars.find(([open, close]) => {
      return (
        (line.match(new RegExp(`\\${open}`, 'g')) || []).length !==
        (line.match(new RegExp(`\\${close}`, 'g')) || []).length
      )
    })?.[1]
  }
}

class D10 extends Solver {
  constructor() {
    super(2021, 10)
  }

  partOne(): string | number {
    this.getTestInput().map((line, i) => {
      const invalidChar = SubAnalyzer.checkLine(line)

      console.log(`Line ${i}: ${invalidChar}`)
      return invalidChar
    })

    return ''
  }

  partTwo(): string | number {
    return ''
  }
}

export default D10
