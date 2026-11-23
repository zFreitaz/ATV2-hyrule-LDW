export type NotaId = "A" | "DOWN" | "RIGHT" | "LEFT" | "UP"

export interface NotaInfo {
  id: NotaId
  label: string
  tecla: string
  freq: number
  linha: number
}

export const NOTAS_OCARINA: NotaInfo[] = [
  { id: "A", label: "A", tecla: "A", freq: 587.33, linha: 4 },
  { id: "DOWN", label: "▼", tecla: "↓", freq: 698.46, linha: 3 },
  { id: "RIGHT", label: "▶", tecla: "→", freq: 880.0, linha: 2 },
  { id: "LEFT", label: "◀", tecla: "←", freq: 987.77, linha: 1 },
  { id: "UP", label: "▲", tecla: "↑", freq: 1174.66, linha: 0 },
]

export const NOTA_MAP = Object.fromEntries(
  NOTAS_OCARINA.map((n) => [n.id, n])
) as Record<NotaId, NotaInfo>

let sharedCtx: AudioContext | null = null

function getAudioCtx() {
  if (!sharedCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedCtx = new Ctx()
  }
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume()
  }
  return sharedCtx
}

export function tocarSomNota(freq: number, duracao = 0.36) {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const gainHarmonic = ctx.createGain()

  osc1.type = "sine"
  osc2.type = "triangle"
  osc1.frequency.setValueAtTime(freq, now)
  osc2.frequency.setValueAtTime(freq * 2, now)
  gainHarmonic.gain.setValueAtTime(0.06, now)

  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.18, now + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duracao)

  osc1.connect(gain)
  osc2.connect(gainHarmonic)
  gainHarmonic.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + duracao + 0.02)
  osc2.stop(now + duracao + 0.02)
}

export function tocarSequencia(notas: NotaId[], intervaloMs = 340) {
  notas.forEach((id, idx) => {
    const info = NOTA_MAP[id]
    if (info) {
      setTimeout(() => tocarSomNota(info.freq, 0.34), idx * intervaloMs)
    }
  })
}

export function tocarSegredoZelda() {
  const freqs = [783.99, 739.99, 622.25, 440.0, 415.3, 659.25, 830.61, 1046.5]
  freqs.forEach((f, idx) => {
    setTimeout(() => tocarSomNota(f, 0.24), idx * 115)
  })
}

export function parseNotas(raw: string | NotaId[]): NotaId[] {
  if (Array.isArray(raw)) return raw
  return raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s): s is NotaId => s in NOTA_MAP)
}