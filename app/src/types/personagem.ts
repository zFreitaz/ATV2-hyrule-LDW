export const RACAS = [
  "Hylian",
  "Kokiri",
  "Zora",
  "Goron",
  "Gerudo",
  "Sheikah",
  "Outro",
] as const

export const PAPEIS = ["Herói", "Aliado", "Vilão", "Sábio", "NPC"] as const

export const STATUS = ["Ativo", "Derrotado", "Desconhecido"] as const

export const ICONES_PERSONAGEM = [
  "espada",
  "triforce",
  "ocarina",
  "fada",
  "coroa",
  "esmeralda",
  "rubi",
  "safira",
  "gerudo",
  "sheikah",
] as const

export type Raca = (typeof RACAS)[number]
export type Papel = (typeof PAPEIS)[number]
export type StatusPersonagem = (typeof STATUS)[number]
export type IconePersonagem = (typeof ICONES_PERSONAGEM)[number]

export interface Personagem {
  id: number
  nome: string
  raca: Raca
  papel: Papel
  local: string
  descricao: string
  nivelPoder: number
  status: StatusPersonagem
  icone?: IconePersonagem | null
}

export type PersonagemInput = Omit<Personagem, "id">