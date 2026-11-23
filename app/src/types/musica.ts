import type { NotaId } from "@/lib/ocarinaAudio"

export interface Musica {
  id: number
  nome: string
  notas: NotaId[]
  efeito: string
  local: string
  descricao: string
}

export type MusicaInput = Omit<Musica, "id">