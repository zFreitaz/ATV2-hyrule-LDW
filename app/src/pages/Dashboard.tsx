import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ArrowUpDown, Pencil, Plus, Search, Trash2 } from "lucide-react"
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
import PersonagemFormDialog from "@/components/PersonagemFormDialog"
import PersonagemIcone, { resolverIcone } from "@/components/PersonagemIcone"
import { personagensApi } from "@/services/personagensApi"
import { PAPEIS } from "@/types/personagem"
import type { Papel, Personagem, PersonagemInput, Raca, StatusPersonagem } from "@/types/personagem"

const corPapel: Record<Papel, string> = {
  Herói: "text-emerald-300/90",
  Sábio: "text-sky-200/90",
  Aliado: "text-[#c9a96e]",
  Vilão: "text-red-300/90",
  NPC: "text-[#9fb0a8]",
}

const dotStatus: Record<StatusPersonagem, string> = {
  Ativo: "bg-emerald-400",
  Derrotado: "bg-red-400",
  Desconhecido: "bg-[#c9a96e]",
}

type Ordenacao = "padrao" | "poder" | "nome"

const labelOrdenacao: Record<Ordenacao, string> = {
  padrao: "Ordem: Registro",
  poder: "Ordem: Maior Poder",
  nome: "Ordem: A–Z",
}

function RacaWatermark({ raca }: { raca: Raca }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className="pointer-events-none absolute -right-4 -bottom-4 size-36 text-[#c9a96e] opacity-[0.045] transition-opacity duration-500 group-hover:opacity-[0.11]"
      aria-hidden="true"
    >
      {raca === "Hylian" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <polygon points="60,16 78,48 42,48" />
          <polygon points="41,50 59,82 23,82" />
          <polygon points="79,50 97,82 61,82" />
        </g>
      )}
      {raca === "Kokiri" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <path d="M60 16 C82 32, 92 56, 80 82 C70 96, 50 96, 40 82 C28 56, 38 32, 60 16 Z" />
          <path d="M60 32 L72 60 L60 80 L48 60 Z" />
        </g>
      )}
      {raca === "Goron" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <polygon points="60,14 96,36 96,80 60,104 24,80 24,36" />
          <polygon points="60,30 82,44 82,72 60,86 38,72 38,44" />
        </g>
      )}
      {raca === "Zora" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <circle cx="60" cy="36" r="16" />
          <circle cx="42" cy="68" r="16" />
          <circle cx="78" cy="68" r="16" />
        </g>
      )}
      {raca === "Gerudo" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <path d="M74 22 A38 38 0 1 0 74 98 A28 28 0 1 1 74 22 Z" />
          <polygon points="78,48 84,60 78,72 72,60" />
        </g>
      )}
      {raca === "Sheikah" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <path d="M16 56 Q60 22 104 56 Q60 90 16 56 Z" />
          <circle cx="60" cy="56" r="14" />
          <path d="M60 74 L65 92 A5 5 0 0 1 55 92 Z" />
        </g>
      )}
      {raca === "Outro" && (
        <g stroke="currentColor" strokeWidth="1.8">
          <polygon points="60,16 104,60 60,104 16,60" />
          <circle cx="60" cy="60" r="14" />
        </g>
      )}
    </svg>
  )
}

export default function Dashboard() {
  const [personagens, setPersonagens] = useState<Personagem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [editando, setEditando] = useState<Personagem | null>(null)
  const [excluindo, setExcluindo] = useState<Personagem | null>(null)
  const [busca, setBusca] = useState<string>("")
  const [filtroPapel, setFiltroPapel] = useState<Papel | "Todos">("Todos")
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("padrao")

  const carregar = useCallback(async () => {
    try {
      setPersonagens(await personagensApi.listar())
    } catch {
      toast.error("Não foi possível carregar os personagens. A API está rodando?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const salvar = async (dados: PersonagemInput) => {
    try {
      if (editando) {
        const atualizado = await personagensApi.atualizar(editando.id, dados)
        setPersonagens((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
        toast.success(`${atualizado.nome} atualizado nos registros.`)
      } else {
        const criado = await personagensApi.criar(dados)
        setPersonagens((prev) => [...prev, criado])
        toast.success(`${criado.nome} inscrito no Compêndio.`)
      }
      setFormOpen(false)
    } catch {
      toast.error("Erro ao salvar o personagem.")
    }
  }

  const confirmarExclusao = async () => {
    if (!excluindo) return
    try {
      await personagensApi.excluir(excluindo.id)
      setPersonagens((prev) => prev.filter((p) => p.id !== excluindo.id))
      toast.success(`${excluindo.nome} removido do Compêndio.`)
    } catch {
      toast.error("Erro ao excluir o personagem.")
    } finally {
      setExcluindo(null)
    }
  }

  const alternarOrdenacao = () => {
    setOrdenacao((prev) => (prev === "padrao" ? "poder" : prev === "poder" ? "nome" : "padrao"))
  }

  const filtrados = useMemo(() => {
    const lista = personagens.filter(
      (p) =>
        (p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.local.toLowerCase().includes(busca.toLowerCase()) ||
          p.raca.toLowerCase().includes(busca.toLowerCase())) &&
        (filtroPapel === "Todos" || p.papel === filtroPapel)
    )

    if (ordenacao === "poder") {
      return [...lista].sort((a, b) => b.nivelPoder - a.nivelPoder)
    }
    if (ordenacao === "nome") {
      return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    }
    return lista
  }, [personagens, busca, filtroPapel, ordenacao])

  const herois = personagens.filter((p) => p.papel === "Herói" || p.papel === "Sábio").length
  const viloes = personagens.filter((p) => p.papel === "Vilão").length

  return (
    <div className="w-full space-y-12 px-6 py-12 sm:px-10 lg:px-16">
      {/* Cabeçalho amplo e limpo */}
      <header className="flex flex-col justify-between gap-6 border-b border-[#c9a96e]/15 pb-9 md:flex-row md:items-end">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c9a96e]/85">
            Índice Geral · Hyrule
          </p>
          <h1 className="font-display text-3xl font-normal tracking-[0.22em] text-[#ebe6da] sm:text-5xl">
            COMPÊNDIO
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <span>
              <strong className="font-display text-xs text-[#c9a96e]">{personagens.length}</strong>{" "}
              Registros
            </span>
            <span className="text-[#c9a96e]/25">·</span>
            <span>
              <strong className="font-display text-xs text-[#ebe6da]">{herois}</strong> Heróis &
              Sábios
            </span>
            <span className="text-[#c9a96e]/25">·</span>
            <span>
              <strong className="font-display text-xs text-red-300/90">{viloes}</strong> Vilões
            </span>
          </div>
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
          Novo Registro
        </button>
      </header>

      {/* Busca, Filtros e Ordenação */}
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-0 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 rounded-none border-0 border-b border-[#c9a96e]/25 !bg-transparent pl-6 text-sm text-[#ebe6da] shadow-none placeholder:text-muted-foreground/80 focus-visible:border-[#c9a96e] focus-visible:ring-0"
            placeholder="Filtrar por nome, raça ou local..."
            value={busca}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {(["Todos", ...PAPEIS] as const).map((p) => {
            const ativo = filtroPapel === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setFiltroPapel(p)}
                className={[
                  "cursor-pointer pb-1.5 text-[10px] uppercase tracking-[0.26em] transition-colors",
                  ativo
                    ? "border-b border-[#c9a96e] text-[#ebe6da]"
                    : "text-muted-foreground hover:text-[#ebe6da]",
                ].join(" ")}
              >
                {p}
              </button>
            )
          })}

          <span className="hidden h-3 w-px bg-[#c9a96e]/20 sm:inline-block" />

          <button
            type="button"
            onClick={alternarOrdenacao}
            className="inline-flex cursor-pointer items-center gap-2 pb-1.5 text-[10px] uppercase tracking-[0.24em] text-[#c9a96e]/85 transition-colors hover:text-[#ebe6da]"
          >
            <ArrowUpDown className="size-3" />
            <span>{labelOrdenacao[ordenacao]}</span>
          </button>
        </div>
      </section>

      {/* Grade Espaçosa */}
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-56 w-full rounded-none bg-card" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="border-y border-[#c9a96e]/15 py-20 text-center">
          <p className="font-editorial text-2xl italic text-[#c9a96e]">
            Nenhum registro encontrado neste volume.
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Ajuste os filtros ou inscreva um novo personagem.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {filtrados.map((p) => (
            <article
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden border border-[#c9a96e]/15 bg-card/70 p-8 transition-all duration-300 hover:border-[#c9a96e]/45 hover:bg-card"
            >
              {/* Marca d'água da raça no fundo do card */}
              <RacaWatermark raca={p.raca} />

              {/* Cabeçalho do Dossiê com Emblema */}
              <div className="relative z-10 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center border border-[#c9a96e]/30 bg-background/80 text-[#c9a96e]">
                      <PersonagemIcone
                        icone={resolverIcone(p.icone, p.raca, p.papel)}
                        className="size-5"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        <span className="text-[#c9a96e]/90">{p.raca}</span>
                        <span className="mx-2 text-[#c9a96e]/30">·</span>
                        <span>{p.local}</span>
                      </p>
                      <h2 className="font-display mt-1 text-2xl font-normal tracking-[0.16em] text-[#ebe6da]">
                        {p.nome}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-medium uppercase tracking-[0.26em] ${corPapel[p.papel]}`}
                  >
                    {p.papel}
                  </span>
                </div>

                <p className="font-editorial text-lg leading-relaxed text-[#c6d0ca]">
                  {p.descricao}
                </p>
              </div>

              {/* Base Minimalista: Poder + Status + Ações discretas */}
              <div className="relative z-10 mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] uppercase tracking-[0.26em] text-muted-foreground">
                    Poder
                  </span>
                  <div className="h-px flex-1 bg-secondary">
                    <div
                      className="h-full bg-[#c9a96e]/85 transition-all duration-500"
                      style={{ width: `${p.nivelPoder}%` }}
                    />
                  </div>
                  <span className="font-display text-xs tracking-widest text-[#c9a96e]">
                    {p.nivelPoder}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#c9a96e]/10 pt-4">
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <span className={`size-1.5 rounded-full ${dotStatus[p.status]}`} />
                    {p.status}
                  </span>

                  <div className="flex items-center gap-5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(p)
                        setFormOpen(true)
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#c9a96e]"
                    >
                      <Pencil className="size-3" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setExcluindo(p)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-red-400"
                    >
                      <Trash2 className="size-3" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <PersonagemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        personagem={editando}
        onSubmit={salvar}
      />

      <Dialog open={excluindo !== null} onOpenChange={(o) => !o && setExcluindo(null)}>
        <DialogContent className="rounded-none border border-[#c9a96e]/30 bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-base uppercase tracking-[0.2em] text-[#ebe6da]">
              Remover Registro
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Deseja apagar <span className="text-[#ebe6da]">&ldquo;{excluindo?.nome}&rdquo;</span>{" "}
              do Compêndio? Esta ação não pode ser desfeita.
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
              className="cursor-pointer rounded-none bg-[#8f2d2d] text-[10px] uppercase tracking-[0.22em] text-[#ebe6da] hover:bg-[#a63737]"
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