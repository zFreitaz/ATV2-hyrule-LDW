import { parseNotas } from "@/lib/ocarinaAudio"
import type { Musica, MusicaInput } from "@/types/musica"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

interface MusicaRaw {
  id: number
  nome: string
  notas: string
  efeito: string
  local: string
  descricao: string
}

const normalizar = (m: MusicaRaw): Musica => ({
  ...m,
  notas: parseNotas(m.notas),
})

export const musicasApi = {
  async listar(): Promise<Musica[]> {
    const res = await fetch(`${API_URL}/musicas`)
    if (!res.ok) throw new Error("Erro ao listar melodias")
    const data: MusicaRaw[] = await res.json()
    return data.map(normalizar)
  },

  async criar(dados: MusicaInput): Promise<Musica> {
    const res = await fetch(`${API_URL}/musicas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dados, notas: dados.notas.join(",") }),
    })
    if (!res.ok) throw new Error("Erro ao criar melodia")
    return normalizar(await res.json())
  },

  async atualizar(id: number, dados: MusicaInput): Promise<Musica> {
    const res = await fetch(`${API_URL}/musicas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dados, notas: dados.notas.join(",") }),
    })
    if (!res.ok) throw new Error("Erro ao atualizar melodia")
    return normalizar(await res.json())
  },

  async excluir(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/musicas/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Erro ao excluir melodia")
  },
}