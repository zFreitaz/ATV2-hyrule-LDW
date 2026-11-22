import type { Personagem, PersonagemInput } from "@/types/personagem"

const API_URL = import.meta.env.VITE_API_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const personagensApi = {
  listar: () => request<Personagem[]>("/personagens"),
  criar: (dados: PersonagemInput) =>
    request<Personagem>("/personagens", { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (id: number, dados: PersonagemInput) =>
    request<Personagem>(`/personagens/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  excluir: (id: number) => request<void>(`/personagens/${id}`, { method: "DELETE" }),
}