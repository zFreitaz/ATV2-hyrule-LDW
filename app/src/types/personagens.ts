export type Raca = "Hylian" | "Kokiri" | "Gerudo" | "Goron" | "Zora" | "Sheikah" | "Outro"
export type Papel = "Herói" | "Aliado" | "Vilão" | "Sábio" | "NPC"
export type StatusPersonagem = "Ativo" | "Derrotado" | "Desconhecido"

export interface Personagem {
  id: number
  nome: string
  raca: Raca
  papel: Papel
  local: string
  descricao: string
  nivelPoder: number
  status: StatusPersonagem
}

export type PersonagemInput = Omit<Personagem, "id">

export const RACAS: Raca[] = ["Hylian", "Kokiri", "Gerudo", "Goron", "Zora", "Sheikah", "Outro"]
export const PAPEIS: Papel[] = ["Herói", "Aliado", "Vilão", "Sábio", "NPC"]
export const STATUS: StatusPersonagem[] = ["Ativo", "Derrotado", "Desconhecido"]