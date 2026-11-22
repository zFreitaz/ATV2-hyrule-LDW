import "dotenv/config"
import express from "express"
import cors from "cors"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const app = express()
app.use(cors())
app.use(express.json())

const COLUNAS = `id, nome, raca, papel, local, descricao, nivel_poder AS "nivelPoder", status`

function valido(b) {
  return (
    b &&
    typeof b.nome === "string" && b.nome.trim() !== "" &&
    typeof b.raca === "string" &&
    typeof b.papel === "string" &&
    typeof b.local === "string" && b.local.trim() !== "" &&
    typeof b.descricao === "string" && b.descricao.trim() !== "" &&
    Number.isInteger(b.nivelPoder) && b.nivelPoder >= 0 && b.nivelPoder <= 100 &&
    typeof b.status === "string"
  )
}

// LISTAR
app.get("/personagens", async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT ${COLUNAS} FROM personagens ORDER BY id`)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao listar personagens" })
  }
})

// CRIAR
app.post("/personagens", async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, raca, papel, local, descricao, nivelPoder, status } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO personagens (nome, raca, papel, local, descricao, nivel_poder, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${COLUNAS}`,
      [nome, raca, papel, local, descricao, nivelPoder, status]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao criar personagem" })
  }
})

// ATUALIZAR
app.put("/personagens/:id", async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ erro: "Dados inválidos" })
  const { nome, raca, papel, local, descricao, nivelPoder, status } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE personagens
       SET nome=$1, raca=$2, papel=$3, local=$4, descricao=$5, nivel_poder=$6, status=$7
       WHERE id=$8 RETURNING ${COLUNAS}`,
      [nome, raca, papel, local, descricao, nivelPoder, status, req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ erro: "Personagem não encontrado" })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao atualizar personagem" })
  }
})

// EXCLUIR
app.delete("/personagens/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM personagens WHERE id=$1", [req.params.id])
    if (rowCount === 0) return res.status(404).json({ erro: "Personagem não encontrado" })
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao excluir personagem" })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))