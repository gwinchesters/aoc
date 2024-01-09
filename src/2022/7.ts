import Solver from '../common/base'

abstract class Node {
  id: string
  name: string
  type: string
  parent: Node | null
  children: Node[] = []

  constructor(
    id: string,
    name: string,
    type: string,
    parent: Node | null = null,
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.parent = parent
  }

  get depth(): number {
    if (this.parent) {
      return this.parent.depth + 1
    }
    return 0
  }

  get isDir() {
    return this.type === 'dir'
  }

  print() {
    const indent = Array(this.depth).fill(' ').join('')

    return `${indent}- ${this.name} (${this.type}, size=${this.getSize()})`
  }

  abstract getSize(): number
}

class File extends Node {
  size: number

  constructor(id: string, name: string, parent: Node, size: number) {
    super(id, name, 'file', parent)
    this.size = size
  }

  getSize(): number {
    return this.size
  }
}

class Directory extends Node {
  constructor(id: string, name: string, parent?: Node) {
    super(id, name, 'dir', parent)
  }

  getSize(): number {
    return this.children.map((c) => c.getSize()).reduce((a, b) => a + b)
  }
}

class FileTree {
  root: Node

  constructor(rootName: string) {
    this.root = new Directory('~', rootName)
  }

  *preOrderTraversal(node: Node = this.root): IterableIterator<Node> {
    yield node

    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child)
      }
    }
  }

  addDirectory(parentId: string, name: string): boolean {
    const dirId = `${parentId}/${name}`

    for (let node of this.preOrderTraversal()) {
      if (node.id === parentId) {
        const dir = new Directory(dirId, name, node)
        node.children.push(dir)
        return true
      }
    }
    return false
  }

  addFile(parentId: string, name: string, size: number): boolean {
    const fileId = `${parentId}/${name}`
    for (let node of this.preOrderTraversal()) {
      if (node.id === parentId) {
        const dir = new File(fileId, name, node, size)
        node.children.push(dir)
        return true
      }
    }
    return false
  }

  find(parentId: string, name: string): Node | undefined {
    for (let node of this.preOrderTraversal()) {
      if (node.id === `${parentId}/${name}`) {
        return node
      }
    }
    return undefined
  }

  printTree() {
    for (let node of this.preOrderTraversal()) {
      console.log(node.print())
    }
  }

  getDirectories(): Node[] {
    const dirs = []
    for (let node of this.preOrderTraversal()) {
      if (node.isDir) {
        dirs.push(node)
      }
    }

    return dirs
  }
}

class FileTreeLoader {
  chgDir = /\$ cd (.*)/
  dirName = /dir (.*)/
  fileName = /\d+ (.*)/
  fileSize = /(\d+) .*/

  rawTree: string[]
  tree: FileTree
  path: string[]

  constructor(rawTree: string[]) {
    this.rawTree = rawTree
    this.tree = this.initTree()
    this.path = [this.tree.root.id]
  }

  initTree(): FileTree {
    const rootDir = this.rawTree.shift()?.match(this.chgDir)?.[1] || '/'
    return new FileTree(rootDir)
  }

  load(): FileTree {
    for (let cmd of this.rawTree) {
      if (this.chgDir.test(cmd)) {
        this.changeDirectory(cmd)
      } else if (this.dirName.test(cmd)) {
        const dirName = this.parseCmd(cmd, this.dirName)
        this.tree.addDirectory(this.currentPath, dirName)
      } else if (this.fileName.test(cmd)) {
        const fileName = this.parseCmd(cmd, this.fileName)
        const fileSize = Number(this.parseCmd(cmd, this.fileSize))
        this.tree.addFile(this.currentPath, fileName, fileSize)
      }
    }

    return this.tree
  }

  changeDirectory(cmd: string) {
    const dirName = this.parseCmd(cmd, this.chgDir)

    if (dirName.includes('..')) {
      this.path.pop()
      return
    }

    const node = this.tree.find(this.currentPath, dirName)

    if (node) {
      this.path.push(node.id)
    }
  }

  parseCmd(cmd: string, matcher: RegExp): string {
    return cmd.match(matcher)?.[1] || cmd
  }

  get currentPath() {
    return this.path.at(-1) || ''
  }
}

class D7 extends Solver {
  fileTree: FileTree

  constructor() {
    super(2022, 7)

    this.fileTree = new FileTreeLoader(this.getInput()).load()
  }

  partOne(): string | number {
    return this.fileTree
      .getDirectories()
      .filter((d) => d.getSize() <= 100000)
      .reduce((acc, dir) => acc + dir.getSize(), 0)
  }

  partTwo(): string | number {
    const diskSpace = 70000000
    const updateSize = 30000000
    const totalFreeSpace = diskSpace - this.fileTree.root.getSize()

    const dirToRemove = this.fileTree
      .getDirectories()
      .filter((d) => totalFreeSpace + d.getSize() >= updateSize)
      .sort((a, b) => a.getSize() - b.getSize())[0]

    return dirToRemove.getSize()
  }
}

export default D7
