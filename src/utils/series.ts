export const generateSeries = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, index) => index + start)
}
