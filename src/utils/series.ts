export const generateSeries = (start: number, end: number, interval = 1) => {
  const series = [start]
  let currentVal = start

  while (currentVal !== end) {
    currentVal += interval
    series.push(currentVal)
  }

  return series
}
