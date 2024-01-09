export const sleep = async (duration: number) => {
  const wait = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })

  await wait
}
