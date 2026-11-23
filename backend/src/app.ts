import express, { type Request, type Response } from "express"
import cors from "cors"
import { pool } from "./config/database.js"

const app = express()
app.use(cors())
app.use(express.json())

const COLUNAS = `id, nome, raca, papel, local, descricao, nivel_poder AS "nivelPoder", status, icone`


interface PersonagemPayload {
  nome?: unknown
  raca?: unknown
  papel?: unknown
  local?: unknown
  descricao?: unknown
  nivelPoder?: unknown
  status?: unknown
  icone?: unknown
}

interface MusicaPayload {
  nome?: unknown
  notas?: unknown
  efeito?: unknown
  local?: unknown
  descricao?: unknown
}

function valido(b: PersonagemPayload | null | undefined): boolean {
  return Boolean(
    b &&
      typeof b.nome === "string" &&
      b.nome.trim() !== "" &&
      typeof b.raca === "string" &&
      typeof b.papel === "string" &&
      typeof b.local === "string" &&
      b.local.trim() !== "" &&
      typeof b.descricao === "string" &&
      b.descricao.trim() !== "" &&
      typeof b.nivelPoder === "number" &&
      Number.isInteger(b.nivelPoder) &&
      b.nivelPoder >= 0 &&
      b.nivelPoder <= 100 &&
      typeof b.status === "string" &&
      (b.icone === undefined || b.icone === null || typeof b.icone === "string")
  )
}

function validaMusica(b: MusicaPayload | null | undefined): boolean {
  return Boolean(
    b &&
      typeof b.nome === "string" &&
      b.nome.trim() !== "" &&
      typeof b.notas === "string" &&
      b.notas.trim() !== "" &&
      typeof b.efeito === "string" &&
      b.efeito.trim() !== "" &&
      typeof b.local === "string" &&
      b.local.trim() !== "" &&
      typeof b.descricao === "string" &&
      b.descricao.trim() !== ""
  )
}


app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    versao: "1.0.1",
  })
})


app.get("/personagens", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`SELECT ${COLUNAS} FROM personagens ORDER BY id`)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao listar personagens" })
  }
})

app.post("/personagens", async (req: Request, res: Response) => {
  if (!valido(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, raca, papel, local, descricao, nivelPoder, status, icone = null } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO personagens (nome, raca, papel, local, descricao, nivel_poder, status, icone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${COLUNAS}`,
      [nome, raca, papel, local, descricao, nivelPoder, status, icone]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao criar personagem" })
  }
})

app.put("/personagens/:id", async (req: Request, res: Response) => {
  if (!valido(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, raca, papel, local, descricao, nivelPoder, status, icone = null } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE personagens
       SET nome=$1, raca=$2, papel=$3, local=$4, descricao=$5, nivel_poder=$6, status=$7, icone=$8
       WHERE id=$9 RETURNING ${COLUNAS}`,
      [nome, raca, papel, local, descricao, nivelPoder, status, icone, req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ erro: "Personagem não encontrado" })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao atualizar personagem" })
  }
})

app.delete("/personagens/:id", async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM personagens WHERE id=$1", [req.params.id])
    if (rowCount === 0) return res.status(404).json({ erro: "Personagem não encontrado" })
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao excluir personagem" })
  }
})


app.get("/musicas", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM musicas ORDER BY id")
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao listar melodias" })
  }
})

app.post("/musicas", async (req: Request, res: Response) => {
  if (!validaMusica(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, notas, efeito, local, descricao } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO musicas (nome, notas, efeito, local, descricao)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, notas, efeito, local, descricao]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao criar melodia" })
  }
})

app.put("/musicas/:id", async (req: Request, res: Response) => {
  if (!validaMusica(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, notas, efeito, local, descricao } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE musicas
       SET nome=$1, notas=$2, efeito=$3, local=$4, descricao=$5
       WHERE id=$6 RETURNING *`,
      [nome, notas, efeito, local, descricao, req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ erro: "Melodia não encontrada" })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao atualizar melodia" })
  }
})

app.delete("/musicas/:id", async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM musicas WHERE id=$1", [req.params.id])
    if (rowCount === 0) return res.status(404).json({ erro: "Melodia não encontrada" })
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao excluir melodia" })
  }
})

export default app