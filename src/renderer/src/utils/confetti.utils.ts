import confetti from 'canvas-confetti'

export function createConfetti(canvas: HTMLCanvasElement): confetti.CreateTypes {
  return confetti.create(canvas, { resize: true })
}
