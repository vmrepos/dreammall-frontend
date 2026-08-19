const SIZE = 21

const isFinder = (x: number, y: number) => {
  const inFinder = (ox: number, oy: number) =>
    x >= ox && x < ox + 7 && y >= oy && y < oy + 7

  return inFinder(0, 0) || inFinder(SIZE - 7, 0) || inFinder(0, SIZE - 7)
}

const finderDark = (x: number, y: number) => {
  const local = (ox: number, oy: number) => {
    const lx = x - ox
    const ly = y - oy
    const onBorder = lx === 0 || ly === 0 || lx === 6 || ly === 6
    const inCenter = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
    return onBorder || inCenter
  }

  if (x < 7 && y < 7) return local(0, 0)
  if (x >= SIZE - 7 && y < 7) return local(SIZE - 7, 0)
  return local(0, SIZE - 7)
}

const dataDark = (x: number, y: number) => ((x * 7 + y * 13 + x * y) % 3) !== 0

export const PlaceholderQr = () => (
  <svg
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    className="size-44 rounded-lg bg-white"
    role="img"
    aria-label="Código QR de pago (placeholder)"
  >
    {Array.from({ length: SIZE * SIZE }, (_, i) => {
      const x = i % SIZE
      const y = Math.floor(i / SIZE)
      const dark = isFinder(x, y) ? finderDark(x, y) : dataDark(x, y)
      if (!dark) return null

      return <rect key={i} x={x} y={y} width={1} height={1} fill="#111827" />
    })}
  </svg>
)
