import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PersonagemIcone, { LABELS_ICONE, resolverIcone } from "@/components/PersonagemIcone"
import { ICONES_PERSONAGEM, PAPEIS, RACAS, STATUS } from "@/types/personagem"
import type { Papel, Personagem, PersonagemInput, Raca, StatusPersonagem } from "@/types/personagem"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  personagem: Personagem | null
  onSubmit: (dados: PersonagemInput) => Promise<void>
}

const vazio: PersonagemInput = {
  nome: "",
  raca: "Hylian",
  papel: "Aliado",
  local: "",
  descricao: "",
  nivelPoder: 50,
  status: "Ativo",
  icone: "espada",
}

export default function PersonagemFormDialog({ open, onOpenChange, personagem, onSubmit }: Props) {
  const [form, setForm] = useState<PersonagemInput>(vazio)
  const [enviando, setEnviando] = useState<boolean>(false)

  useEffect(() => {
    if (open) {
      if (personagem) {
        const { nome, raca, papel, local, descricao, nivelPoder, status, icone } = personagem
        setForm({
          nome,
          raca,
          papel,
          local,
          descricao,
          nivelPoder,
          status,
          icone: resolverIcone(icone, raca, papel),
        })
      } else {
        setForm(vazio)
      }
    }
  }, [open, personagem])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
            {personagem ? "Editar Registro" : "Novo Registro"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Preencha os dados para inscrever o personagem no Compêndio de Hyrule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Link, Sheik, Saria..."
                className="rounded-none border-[#c9a96e]/25 bg-background"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="local" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Local
              </Label>
              <Input
                id="local"
                name="local"
                placeholder="Ex: Floresta Kokiri"
                className="rounded-none border-[#c9a96e]/25 bg-background"
                value={form.local}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              name="descricao"
              rows={3}
              className="rounded-none border-[#c9a96e]/25 bg-background"
              value={form.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 border border-[#c9a96e]/15 bg-background p-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="nivelPoder" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Nível de Poder
              </Label>
              <span className="font-display text-xs text-[#c9a96e]">{form.nivelPoder} / 100</span>
            </div>
            <input
              id="nivelPoder"
              name="nivelPoder"
              type="range"
              min={0}
              max={100}
              value={form.nivelPoder}
              onChange={handleChange}
              className="h-1 w-full cursor-pointer appearance-none bg-secondary accent-[#c9a96e]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Raça</Label>
              <Select value={form.raca} onValueChange={(v) => setForm((p) => ({ ...p, raca: v as Raca }))}>
                <SelectTrigger className="w-full rounded-none border-[#c9a96e]/25 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#c9a96e]/30 bg-popover">
                  {RACAS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Papel</Label>
              <Select value={form.papel} onValueChange={(v) => setForm((p) => ({ ...p, papel: v as Papel }))}>
                <SelectTrigger className="w-full rounded-none border-[#c9a96e]/25 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#c9a96e]/30 bg-popover">
                  {PAPEIS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v as StatusPersonagem }))}
              >
                <SelectTrigger className="w-full rounded-none border-[#c9a96e]/25 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#c9a96e]/30 bg-popover">
                  {STATUS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seletor de Emblema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Emblema do Personagem
              </Label>
              {form.icone && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                  {LABELS_ICONE[form.icone]}
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ICONES_PERSONAGEM.map((ic) => {
                const ativo = form.icone === ic
                return (
                  <button
                    key={ic}
                    type="button"
                    title={LABELS_ICONE[ic]}
                    onClick={() => setForm((p) => ({ ...p, icone: ic }))}
                    className={[
                      "flex h-10 cursor-pointer items-center justify-center border transition-colors",
                      ativo
                        ? "border-[#c9a96e] bg-[#c9a96e]/20 text-[#f5e3b3]"
                        : "border-[#c9a96e]/20 bg-background text-muted-foreground hover:border-[#c9a96e]/50 hover:text-[#ebe6da]",
                    ].join(" ")}
                  >
                    <PersonagemIcone icone={ic} className="size-5" />
                  </button>
                )
              })}
            </div>
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
              disabled={enviando}
              className="cursor-pointer rounded-none bg-[#c9a96e] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#08100d] hover:bg-[#d9bc84]"
            >
              {enviando ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}