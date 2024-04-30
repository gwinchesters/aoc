import Solver from '../common/base'

interface Box {
  label: string
  focalLen: number
}

interface Step {
  hash: number
  label: string
  op: '=' | '-'
  len: string | undefined
}

class BoxMap {
  boxmap: Box[][]

  constructor(numBoxes = 256) {
    this.boxmap = Array(numBoxes)
      .fill(null)
      .map(() => [])
  }

  runSteps(steps: string[], print = false) {
    for (const step of steps) {
      this.runStep(step)

      if (print) {
        this.print(`After "${step}":`)
      }
    }
  }

  getTotalFocusingPower() {
    return this.boxmap.reduce((totalPower, boxes, boxNum) => {
      if (boxes.length > 0) {
        return boxes.reduce((tp, b, slotNum) => {
          return tp + (1 + boxNum) * (1 + slotNum) * b.focalLen
        }, totalPower)
      }

      return totalPower
    }, 0)
  }

  runStep(step: string) {
    const { hash, label, op, len } = this.parseStep(step)

    const boxIndex = this.boxmap[hash].findIndex((b) => b.label === label)

    if (op === '-' && boxIndex > -1) {
      this.boxmap[hash].splice(boxIndex, 1)
    } else if (op === '=') {
      if (boxIndex > -1) {
        this.boxmap[hash][boxIndex].focalLen = Number(len)
      } else {
        this.boxmap[hash].push({
          label,
          focalLen: Number(len),
        })
      }
    }
  }

  parseStep(step: string): Step {
    const stepRegex = /(?<label>\w+)(?<op>=|-)(?<len>\d+)?/

    const { groups } = step.match(stepRegex) ?? {}

    if (groups) {
      return {
        hash: this.hash(groups.label),
        label: groups.label,
        op: groups.op as Step['op'],
        len: groups.len,
      }
    }

    return {} as Step
  }

  hash(label: string) {
    return label.split('').reduce((v: number, c: string) => {
      return ((v + c.charCodeAt(0)) * 17) % 256
    }, 0)
  }

  print(title: string) {
    console.log(title)

    this.boxmap.forEach((boxes, i) => {
      if (boxes.length > 0) {
        console.log(
          `Box ${i}: ${boxes
            .map((b) => `[${b.label} ${b.focalLen}]`)
            .join(' ')}`,
        )
      }
    })
  }
}

export default class D15 extends Solver {
  constructor() {
    super(2023, 15)
  }

  p1Hash(seq: string, val = 0): number {
    return seq.split('').reduce((v: number, c: string) => {
      return ((v + c.charCodeAt(0)) * 17) % 256
    }, val)
  }

  getInitSeq(input = this.getInput()) {
    return input[0].split(',')
  }

  partOne(): string | number {
    return this.getInitSeq()
      .map((s) => this.p1Hash(s))
      .reduce((a, b) => a + b, 0)
  }

  partTwo(): string | number {
    const bm = new BoxMap()

    bm.runSteps(this.getInitSeq())

    return bm.getTotalFocusingPower()
  }
}
