import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PersonagemFormDialog from "@/components/PersonagemFormDialog"
import { personagensApi } from "@/services/personagensApi"
import { PAPEIS } from "@/types/personagem"
import type { Papel, Personagem, PersonagemInput } from "@/types/personagem"

export default function Dashboard() {
  const [personagens, setPersonagens] = useState<Personagem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [editando, setEditando] = useState<Personagem | null>(null)
  const [excluindo, setExcluindo] = useState<Personagem | null>(null)
  const [busca, setBusca] = useState<string>("")
  const [filtroPapel, setFiltroPapel] = useState<Papel | "Todos">("Todos")

  const carregar = useCallback(async () => {
    try {
      setPersonagens(await personagensApi.listar())
    } catch {
      toast.error("Não foi possível carregar os personagens. A API está rodando?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const salvar = async (dados: PersonagemInput) => {
    try {
      if (editando) {
        const atualizado = await personagensApi.atualizar(editando.id, dados)
        setPersonagens((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
        toast.success("Personagem atualizado!")
      } else {
        const criado = await personagensApi.criar(dados)
        setPersonagens((prev) => [...prev, criado])
        toast.success("Personagem cadastrado em Hyrule!")
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
      toast.success("Personagem removido!")
    } catch {
      toast.error("Erro ao excluir o personagem.")
    } finally {
      setExcluindo(null)
    }
  }

  const filtrados = useMemo(
    () =>
      personagens.filter(
        (p) =>
          p.nome.toLowerCase().includes(busca.toLowerCase()) &&
          (filtroPapel === "Todos" || p.papel === filtroPapel)
      ),
    [personagens, busca, filtroPapel]
  )

  const herois = personagens.filter((p) => p.papel === "Herói" || p.papel === "Sábio").length
  const viloes = personagens.filter((p) => p.papel === "Vilão").length

  const corPapel = (papel: Papel): "default" | "destructive" | "secondary" | "outline" =>
    papel === "Vilão" ? "destructive" : papel === "Herói" ? "default" : papel === "Sábio" ? "secondary" : "outline"

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Personagens</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{personagens.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Heróis e Sábios</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{herois}</CardContent></Card>
        <Card><CardHeader><CardTitle>Vilões</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{viloes}</CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="max-w-xs"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
        />
        {(["Todos", ...PAPEIS] as const).map((p) => (
          <Button key={p} size="sm" variant={filtroPapel === p ? "default" : "outline"} onClick={() => setFiltroPapel(p)}>{p}</Button>
        ))}
        <Button className="ml-auto" onClick={() => { setEditando(null); setFormOpen(true) }}>+ Novo personagem</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => <Skeleton key={n} className="h-56 w-full" />)}
        </div>
      ) : filtrados.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">
          🧚 Nenhum personagem encontrado, herói! Clique em "Novo personagem" para registrar alguém.
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{p.nome}</CardTitle>
                  <Badge variant={corPapel(p.papel)}>{p.papel}</Badge>
                </div>
                <CardDescription>{p.raca} · {p.local}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{p.descricao}</p>
                <div>
                  <div className="mb-1 flex justify-between text-xs"><span>Poder</span><span>{p.nivelPoder}/100</span></div>
                  <div className="h-2 w-full rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${p.nivelPoder}%` }} /></div>
                </div>
                <Badge variant="outline">{p.status}</Badge>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditando(p); setFormOpen(true) }}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => setExcluindo(p)}>Excluir</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <PersonagemFormDialog open={formOpen} onOpenChange={setFormOpen} personagem={editando} onSubmit={salvar} />

      <Dialog open={excluindo !== null} onOpenChange={(o) => !o && setExcluindo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir personagem?</DialogTitle>
            <DialogDescription>Isso removerá "{excluindo?.nome}" de Hyrule.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExcluindo(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarExclusao}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}