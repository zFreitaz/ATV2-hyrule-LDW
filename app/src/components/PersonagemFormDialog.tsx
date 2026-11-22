import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PAPEIS, RACAS, STATUS } from "@/types/personagem"
import type { Papel, Personagem, PersonagemInput, Raca, StatusPersonagem } from "@/types/personagem"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  personagem: Personagem | null
  onSubmit: (dados: PersonagemInput) => Promise<void>
}

const vazio: PersonagemInput = {
  nome: "", raca: "Hylian", papel: "Aliado", local: "", descricao: "", nivelPoder: 50, status: "Ativo",
}

export default function PersonagemFormDialog({ open, onOpenChange, personagem, onSubmit }: Props) {
  const [form, setForm] = useState<PersonagemInput>(vazio)
  const [enviando, setEnviando] = useState<boolean>(false)

  useEffect(() => {
    if (open) setForm(personagem ? { ...personagem } : vazio)
  }, [open, personagem])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)
    await onSubmit(form)
    setEnviando(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{personagem ? "Editar personagem" : "Novo personagem"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Input id="local" name="local" value={form.local} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nivelPoder">Nível de poder (0 a 100)</Label>
            <Input id="nivelPoder" name="nivelPoder" type="number" min={0} max={100} value={form.nivelPoder} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Raça</Label>
              <Select value={form.raca} onValueChange={(v) => setForm((p) => ({ ...p, raca: v as Raca }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{RACAS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select value={form.papel} onValueChange={(v) => setForm((p) => ({ ...p, papel: v as Papel }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PAPEIS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as StatusPersonagem }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={enviando}>{enviando ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}