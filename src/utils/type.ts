export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Range = [number, number]

export type Tup<T> = [T, T]