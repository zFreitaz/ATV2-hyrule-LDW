import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Music, X } from "lucide-react"
import { NOTA_MAP, NOTAS_OCARINA, tocarSegredoZelda, tocarSomNota } from "@/lib/ocarinaAudio"
import type { NotaId } from "@/lib/ocarinaAudio"
import { musicasApi } from "@/services/musicasApi"
import type { Musica } from "@/types/musica"

const FALLBACK_MELODIAS: Pick<Musica, "id" | "nome" | "notas" | "efeito">[] = [
  { id: -1, nome: "Song of Time", notas: ["RIGHT", "A", "DOWN", "RIGHT", "A", "DOWN"], efeito: "Alterna Era" },
  { id: -2, nome: "Song of Storms", notas: ["A", "DOWN", "UP", "A", "DOWN", "UP"], efeito: "Chuva" },
  { id: -3, nome: "Zelda's Lullaby", notas: ["LEFT", "UP", "RIGHT", "LEFT", "UP", "RIGHT"], efeito: "Selo Real" },
]

interface Props {
  open: boolean
  onClose: () => void
  onToggleEra: () => void
  onToggleTempestade: () => void
}

export default function OcarinaBar({ open, onClose, onToggleEra, onToggleTempestade }: Props) {
  const [melodias, setMelodias] = useState(FALLBACK_MELODIAS)
  const [historico, setHistorico] = useState<NotaId[]>([])
  const [notaAtiva, setNotaAtiva] = useState<NotaId | null>(null)

  const carregarMelodias = useCallback(async () => {
    try {
      const lista = await musicasApi.listar()
      if (lista.length > 0) setMelodias(lista)
    } catch {
      // Mantém fallback se o backend /musicas ainda não estiver rodando
    }
  }, [])

  useEffect(() => {
    carregarMelodias()
    window.addEventListener("hyrule:musicas-updated", carregarMelodias)
    return () => window.removeEventListener("hyrule:musicas-updated", carregarMelodias)
  }, [carregarMelodias])

  const tocarNota = useCallback(
    (id: NotaId) => {
      tocarSomNota(NOTA_MAP[id].freq)
      setNotaAtiva(id)
      setTimeout(() => setNotaAtiva((curr) => (curr === id ? null : curr)), 180)

      setHistorico((prev) => {
        const proximo = [...prev, id].slice(-8)

        for (const m of melodias) {
          if (m.notas.length > 0 && proximo.length >= m.notas.length) {
            const trecho = proximo.slice(-m.notas.length)
            if (trecho.every((n, i) => n === m.notas[i])) {
              setTimeout(() => {
                tocarSegredoZelda()
                const nomeLower = m.nome.toLowerCase()
                if (nomeLower.includes("time")) {
                  onToggleEra()
                  toast.success(`${m.nome} — As portas do Templo do Tempo se abriram.`)
                } else if (nomeLower.includes("storm")) {
                  onToggleTempestade()
                  toast.success(`${m.nome} — Uma tempestade caiu sobre Hyrule.`)
                } else {
                  toast.success(`${m.nome} — ${m.efeito}`)
                }
              }, 220)
              return []
            }
          }
        }
        return proximo
      })
    },
    [melodias, onToggleEra, onToggleTempestade]
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      const mapa: Record<string, NotaId> = {
        KeyA: "A",
        ArrowDown: "DOWN",
        ArrowRight: "RIGHT",
        ArrowLeft: "LEFT",
        ArrowUp: "UP",
      }
      const nota = mapa[e.code]
      if (nota) {
        e.preventDefault()
        tocarNota(nota)
      } else if (e.code === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, tocarNota, onClose])

  if (!open) return null

  return (
    <div className="fixed right-4 bottom-5 left-4 z-50 mx-auto max-w-3xl border border-[#c9a96e]/40 bg-background/95 p-5 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between border-b border-[#c9a96e]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <Music className="size-4 text-[#c9a96e]" />
          <span className="font-display text-xs uppercase tracking-[0.26em] text-[#ebe6da]">
            Ocarina of Time
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            · Clique ou use A + Setas
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer p-1 text-muted-foreground transition-colors hover:text-[#ebe6da]"
          aria-label="Fechar Ocarina"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Pauta Musical */}
      <div className="relative my-5 flex h-16 items-center justify-center gap-5 px-4 sm:gap-8">
        <div className="pointer-events-none absolute inset-x-0 inset-y-2 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="h-px w-full bg-[#c9a96e]/20" />
          ))}
        </div>

        {historico.length === 0 ? (
          <span className="relative z-10 font-editorial text-base italic text-muted-foreground">
            Toque uma melodia do Compêndio...
          </span>
        ) : (
          historico.map((id, i) => {
            const info = NOTA_MAP[id]
            const offset = (info.linha - 2) * 10
            return (
              <span
                key={`${id}-${i}`}
                style={{ transform: `translateY(${offset}px)` }}
                className={[
                  "relative z-10 flex size-7 items-center justify-center rounded-full border text-xs font-bold",
                  id === "A"
                    ? "border-sky-300/70 bg-sky-500/25 text-sky-200"
                    : "border-[#c9a96e]/80 bg-[#c9a96e]/25 text-[#f5e3b3]",
                ].join(" ")}
              >
                {info.label}
              </span>
            )
          })
        )}
      </div>

      {/* 5 Botões */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {NOTAS_OCARINA.map((n) => {
          const ativa = notaAtiva === n.id
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => tocarNota(n.id)}
              className={[
                "flex h-11 w-14 cursor-pointer flex-col items-center justify-center border transition-all",
                n.id === "A"
                  ? ativa
                    ? "border-sky-300 bg-sky-400/30 text-white"
                    : "border-sky-400/40 bg-sky-500/10 text-sky-200 hover:border-sky-300"
                  : ativa
                    ? "border-[#f5e3b3] bg-[#c9a96e] text-[#08100d]"
                    : "border-[#c9a96e]/35 bg-[#c9a96e]/10 text-[#ebe6da] hover:border-[#c9a96e]",
              ].join(" ")}
            >
              <span className="text-sm font-semibold leading-none">{n.label}</span>
              <span className="mt-1 text-[8px] uppercase tracking-widest opacity-60">{n.tecla}</span>
            </button>
          )
        })}
      </div>

      {/* Cola das Melodias carregadas do banco */}
      <div className="mt-5 grid max-h-28 gap-2 overflow-y-auto border-t border-[#c9a96e]/15 pt-4 text-center sm:grid-cols-3">
        {melodias.slice(0, 6).map((m) => (
          <div key={m.id} className="space-y-0.5">
            <p className="truncate text-[9px] uppercase tracking-[0.2em] text-[#c9a96e]">
              {m.nome}
            </p>
            <p className="font-mono text-xs tracking-widest text-[#ebe6da]/85">
              {m.notas.map((n) => NOTA_MAP[n].label).join(" ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}