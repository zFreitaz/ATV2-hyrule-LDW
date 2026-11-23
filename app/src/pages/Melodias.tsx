import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Music, Pencil, Play, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import MusicaFormDialog from "@/components/MusicaFormDialog"
import { NOTA_MAP, tocarSequencia } from "@/lib/ocarinaAudio"
import { musicasApi } from "@/services/musicasApi"
import type { Musica, MusicaInput } from "@/types/musica"

export default function Melodias() {
  const [musicas, setMusicas] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editando, setEditando] = useState<Musica | null>(null)
  const [excluindo, setExcluindo] = useState<Musica | null>(null)
  const [tocandoId, setTocandoId] = useState<number | null>(null)

  const carregar = useCallback(async () => {
    try {
      setMusicas(await musicasApi.listar())
    } catch {
      toast.error("Não foi possível carregar as melodias. A API /musicas está rodando?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const salvar = async (dados: MusicaInput) => {
    try {
      if (editando) {
        const atualizada = await musicasApi.atualizar(editando.id, dados)
        setMusicas((prev) => prev.map((m) => (m.id === atualizada.id ? atualizada : m)))
        toast.success(`${atualizada.nome} atualizada no Grimório Musical.`)
      } else {
        const criada = await musicasApi.criar(dados)
        setMusicas((prev) => [...prev, criada])
        toast.success(`${criada.nome} registrada na Ocarina!`)
      }
      window.dispatchEvent(new Event("hyrule:musicas-updated"))
      setFormOpen(false)
    } catch {
      toast.error("Erro ao salvar a melodia.")
    }
  }

  const confirmarExclusao = async () => {
    if (!excluindo) return
    try {
      await musicasApi.excluir(excluindo.id)
      setMusicas((prev) => prev.filter((m) => m.id !== excluindo.id))
      window.dispatchEvent(new Event("hyrule:musicas-updated"))
      toast.success(`${excluindo.nome} removida.`)
    } catch {
      toast.error("Erro ao excluir a melodia.")
    } finally {
      setExcluindo(null)
    }
  }

  const reproduzir = (m: Musica) => {
    setTocandoId(m.id)
    tocarSequencia(m.notas, 320)
    setTimeout(
      () => setTocandoId((curr) => (curr === m.id ? null : curr)),
      m.notas.length * 330 + 300
    )
  }

  const filtradas = useMemo(
    () =>
      musicas.filter(
        (m) =>
          m.nome.toLowerCase().includes(busca.toLowerCase()) ||
          m.efeito.toLowerCase().includes(busca.toLowerCase()) ||
          m.local.toLowerCase().includes(busca.toLowerCase())
      ),
    [musicas, busca]
  )

  return (
    <div className="w-full space-y-12 px-6 py-12 sm:px-10 lg:px-16">
      <header className="flex flex-col justify-between gap-6 border-b border-[#c9a96e]/15 pb-9 md:flex-row md:items-end">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c9a96e]/85">
            Partituras do Tempo · Ocarina of Time
          </p>
          <h1 className="font-display text-3xl font-normal tracking-[0.22em] text-[#ebe6da] sm:text-5xl">
            MELODIAS
          </h1>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <strong className="font-display text-xs text-[#c9a96e]">{musicas.length}</strong>{" "}
            Canções Registradas · Reconhecidas automaticamente na Ocarina
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditando(null)
            setFormOpen(true)
          }}
          className="inline-flex cursor-pointer items-center gap-2.5 border border-[#c9a96e]/50 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.26em] text-[#ebe6da] transition-all hover:border-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#08100d]"
        >
          <Plus className="size-3.5" />
          Nova Melodia
        </button>
      </header>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-0 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-10 rounded-none border-0 border-b border-[#c9a96e]/25 !bg-transparent pl-6 text-sm text-[#ebe6da] shadow-none placeholder:text-muted-foreground/80 focus-visible:border-[#c9a96e] focus-visible:ring-0"
          placeholder="Buscar por nome, efeito ou local..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-60 w-full rounded-none bg-card" />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div className="border-y border-[#c9a96e]/15 py-20 text-center">
          <p className="font-editorial text-2xl italic text-[#c9a96e]">
            Nenhuma melodia encontrada neste volume.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {filtradas.map((m) => {
            const tocando = tocandoId === m.id
            return (
              <article
                key={m.id}
                className="group flex flex-col justify-between border border-[#c9a96e]/15 bg-card/70 p-8 transition-all duration-300 hover:border-[#c9a96e]/45 hover:bg-card"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        <span className="text-[#c9a96e]/90">{m.efeito}</span>
                        <span className="mx-2 text-[#c9a96e]/30">·</span>
                        <span>{m.local}</span>
                      </p>
                      <h2 className="font-display mt-2 text-2xl font-normal tracking-[0.14em] text-[#ebe6da]">
                        {m.nome}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => reproduzir(m)}
                      className={[
                        "inline-flex shrink-0 cursor-pointer items-center gap-2 border px-3.5 py-2 text-[10px] uppercase tracking-[0.22em] transition-all",
                        tocando
                          ? "border-[#c9a96e] bg-[#c9a96e] text-[#08100d]"
                          : "border-[#c9a96e]/40 text-[#c9a96e] hover:border-[#c9a96e] hover:bg-[#c9a96e]/15",
                      ].join(" ")}
                    >
                      {tocando ? (
                        <Music className="size-3 animate-pulse" />
                      ) : (
                        <Play className="size-3" />
                      )}
                      <span>{tocando ? "Tocando" : "Tocar"}</span>
                    </button>
                  </div>

                  {/* Pauta visual com as notas da Ocarina */}
                  <div className="relative flex items-center justify-center gap-3 border-y border-[#c9a96e]/12 py-4">
                    {m.notas.map((id, idx) => (
                      <span
                        key={`${id}-${idx}`}
                        className={[
                          "flex size-8 items-center justify-center rounded-full border text-xs font-bold",
                          id === "A"
                            ? "border-sky-300/70 bg-sky-500/20 text-sky-200"
                            : "border-[#c9a96e]/70 bg-[#c9a96e]/15 text-[#f5e3b3]",
                        ].join(" ")}
                      >
                        {NOTA_MAP[id].label}
                      </span>
                    ))}
                  </div>

                  <p className="font-editorial text-lg leading-relaxed text-[#c6d0ca]">
                    {m.descricao}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-5 border-t border-[#c9a96e]/10 pt-4 opacity-65 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(m)
                      setFormOpen(true)
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#c9a96e]"
                  >
                    <Pencil className="size-3" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setExcluindo(m)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-red-400"
                  >
                    <Trash2 className="size-3" />
                    Excluir
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <MusicaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        musica={editando}
        onSubmit={salvar}
      />

      <Dialog open={excluindo !== null} onOpenChange={(o) => !o && setExcluindo(null)}>
        <DialogContent className="rounded-none border border-[#c9a96e]/30 bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-base uppercase tracking-[0.2em] text-[#ebe6da]">
              Remover Melodia
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Deseja apagar <span className="text-[#ebe6da]">&ldquo;{excluindo?.nome}&rdquo;</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t border-[#c9a96e]/15 bg-background">
            <Button
              variant="outline"
              className="cursor-pointer rounded-none border-[#c9a96e]/25 text-[10px] uppercase tracking-[0.22em]"
              onClick={() => setExcluindo(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer rounded-none bg-[#8f2d2d] text-[10px] uppercase tracking-[0.22em] text-[#ebe6da]"
              onClick={confirmarExclusao}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}