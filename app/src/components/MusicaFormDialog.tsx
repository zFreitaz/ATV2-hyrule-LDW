import { useEffect, useState } from "react"
import { Delete, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NOTA_MAP, NOTAS_OCARINA, tocarSequencia, tocarSomNota } from "@/lib/ocarinaAudio"
import type { NotaId } from "@/lib/ocarinaAudio"
import type { Musica, MusicaInput } from "@/types/musica"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  musica: Musica | null
  onSubmit: (dados: MusicaInput) => Promise<void>
}

const vazio: MusicaInput = {
  nome: "",
  notas: [],
  efeito: "",
  local: "",
  descricao: "",
}

export default function MusicaFormDialog({ open, onOpenChange, musica, onSubmit }: Props) {
  const [form, setForm] = useState<MusicaInput>(vazio)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (open) {
      if (musica) {
        const { nome, notas, efeito, local, descricao } = musica
        setForm({ nome, notas: [...notas], efeito, local, descricao })
      } else {
        setForm(vazio)
      }
    }
  }, [open, musica])

  const adicionarNota = (id: NotaId) => {
    tocarSomNota(NOTA_MAP[id].freq)
    setForm((prev) => {
      if (prev.notas.length >= 8) return prev
      return { ...prev, notas: [...prev.notas, id] }
    })
  }

  const removerUltima = () => {
    setForm((prev) => ({ ...prev, notas: prev.notas.slice(0, -1) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.notas.length < 3) return
    setEnviando(true)
    try {
      await onSubmit(form)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-[#c9a96e]/30 bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-base uppercase tracking-[0.22em] text-[#c9a96e]">
            {musica ? "Editar Melodia" : "Nova Melodia"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Toque os botões da Ocarina para registrar a sequência de notas do jogo (3 a 8 notas).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="m-nome" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Nome da Melodia
              </Label>
              <Input
                id="m-nome"
                placeholder="Ex: Bolero of Fire"
                className="rounded-none border-[#c9a96e]/25 bg-background"
                value={form.nome}
                onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-efeito" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Efeito no Jogo
              </Label>
              <Input
                id="m-efeito"
                placeholder="Ex: Teleporte Cratera da Morte"
                className="rounded-none border-[#c9a96e]/25 bg-background"
                value={form.efeito}
                onChange={(e) => setForm((p) => ({ ...p, efeito: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-local" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Local onde é aprendida
            </Label>
            <Input
              id="m-local"
              placeholder="Ex: Cratera da Montanha da Morte"
              className="rounded-none border-[#c9a96e]/25 bg-background"
              value={form.local}
              onChange={(e) => setForm((p) => ({ ...p, local: e.target.value }))}
              required
            />
          </div>

          {/* Compositor de Notas da Ocarina */}
          <div className="space-y-3 border border-[#c9a96e]/20 bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Sequência ({form.notas.length}/8)
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={form.notas.length === 0}
                  onClick={() => tocarSequencia(form.notas)}
                  className="inline-flex cursor-pointer items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a96e] disabled:opacity-35"
                >
                  <Play className="size-3" /> Ouvir
                </button>
                <button
                  type="button"
                  disabled={form.notas.length === 0}
                  onClick={removerUltima}
                  className="inline-flex cursor-pointer items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[#ebe6da] disabled:opacity-35"
                >
                  <Delete className="size-3" /> Apagar
                </button>
                <button
                  type="button"
                  disabled={form.notas.length === 0}
                  onClick={() => setForm((p) => ({ ...p, notas: [] }))}
                  className="inline-flex cursor-pointer items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-red-400 disabled:opacity-35"
                >
                  <RotateCcw className="size-3" /> Limpar
                </button>
              </div>
            </div>

            {/* Prévia das notas gravadas */}
            <div className="flex min-h-11 flex-wrap items-center justify-center gap-2 border-y border-[#c9a96e]/15 py-2.5">
              {form.notas.length === 0 ? (
                <span className="font-editorial text-sm italic text-muted-foreground">
                  Clique nos botões abaixo para montar a melodia...
                </span>
              ) : (
                form.notas.map((id, i) => (
                  <span
                    key={`${id}-${i}`}
                    className={[
                      "flex size-7 items-center justify-center rounded-full border text-xs font-bold",
                      id === "A"
                        ? "border-sky-300/70 bg-sky-500/20 text-sky-200"
                        : "border-[#c9a96e]/75 bg-[#c9a96e]/20 text-[#f5e3b3]",
                    ].join(" ")}
                  >
                    {NOTA_MAP[id].label}
                  </span>
                ))
              )}
            </div>

            {/* Botões das 5 notas */}
            <div className="flex items-center justify-center gap-2">
              {NOTAS_OCARINA.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => adicionarNota(n.id)}
                  className={[
                    "flex h-9 w-11 cursor-pointer items-center justify-center border text-xs font-semibold transition-colors",
                    n.id === "A"
                      ? "border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/25"
                      : "border-[#c9a96e]/35 bg-[#c9a96e]/10 text-[#ebe6da] hover:bg-[#c9a96e]/25",
                  ].join(" ")}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="m-desc" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Descrição
            </Label>
            <Textarea
              id="m-desc"
              rows={2}
              className="rounded-none border-[#c9a96e]/25 bg-background"
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              required
            />
          </div>

          <DialogFooter className="border-t border-[#c9a96e]/15 bg-background">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-none border-[#c9a96e]/25 text-[10px] uppercase tracking-[0.22em]"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={enviando || form.notas.length < 3}
              className="cursor-pointer rounded-none bg-[#c9a96e] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#08100d] hover:bg-[#d9bc84] disabled:opacity-40"
            >
              {enviando ? "Salvando..." : "Salvar Melodia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}