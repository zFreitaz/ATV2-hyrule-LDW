import "dotenv/config"
import express from "express"
import cors from "cors"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const app = express()
app.use(cors())
app.use(express.json())

const COLUNAS = `id, nome, raca, papel, local, descricao, nivel_poder AS "nivelPoder", status, icone`

function valido(b) {
  return (
    b &&
    typeof b.nome === "string" && b.nome.trim() !== "" &&
    typeof b.raca === "string" &&
    typeof b.papel === "string" &&
    typeof b.local === "string" && b.local.trim() !== "" &&
    typeof b.descricao === "string" && b.descricao.trim() !== "" &&
    Number.isInteger(b.nivelPoder) && b.nivelPoder >= 0 && b.nivelPoder <= 100 &&
    typeof b.status === "string" &&
    (b.icone === undefined || b.icone === null || typeof b.icone === "string")
  )
}

function validaMusica(b) {
  return (
    b &&
    typeof b.nome === "string" && b.nome.trim() !== "" &&
    typeof b.notas === "string" && b.notas.trim() !== "" &&
    typeof b.efeito === "string" && b.efeito.trim() !== "" &&
    typeof b.local === "string" && b.local.trim() !== "" &&
    typeof b.descricao === "string" && b.descricao.trim() !== ""
  )
}

// ==========================================
// PERSONAGENS
// ==========================================

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

// ATUALIZAR
app.put("/personagens/:id", async (req, res) => {
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

// ==========================================
// MELODIAS (OCARINA OF TIME)
// ==========================================

// LISTAR
app.get("/musicas", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM musicas ORDER BY id")
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao listar melodias" })
  }
})

// CRIAR
app.post("/musicas", async (req, res) => {
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

// ATUALIZAR
app.put("/musicas/:id", async (req, res) => {
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

// EXCLUIR
app.delete("/musicas/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM musicas WHERE id=$1", [req.params.id])
    if (rowCount === 0) return res.status(404).json({ erro: "Melodia não encontrada" })
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ erro: "Erro ao excluir melodia" })
  }
})

async function initDb() {
  try {
    await pool.query(`
      ALTER TABLE personagens
      ADD COLUMN IF NOT EXISTS icone VARCHAR(40);
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS musicas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        notas VARCHAR(120) NOT NULL,
        efeito VARCHAR(120) NOT NULL,
        local VARCHAR(100) NOT NULL,
        descricao TEXT NOT NULL
      );
    `)

    const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM musicas")
    if (rows[0].total === 0) {
      await pool.query(`
        INSERT INTO musicas (nome, notas, efeito, local, descricao) VALUES
          ('Song of Time', 'RIGHT,A,DOWN,RIGHT,A,DOWN', 'Alterna Era (+7 Anos)', 'Templo do Tempo', 'Abre a Porta do Tempo e alterna entre a Era da Criança e a Era Adulta.'),
          ('Song of Storms', 'A,DOWN,UP,A,DOWN,UP', 'Invoca Tempestade', 'Moinho de Kakariko', 'Melodia ensinada pelo homem do moinho capaz de invocar uma tempestade sobre Hyrule.'),
          ('Zelda''s Lullaby', 'LEFT,UP,RIGHT,LEFT,UP,RIGHT', 'Selo Real', 'Castelo de Hyrule', 'Canção de ninar da Família Real que prova o vínculo do Herói com a princesa Zelda.'),
          ('Saria''s Song', 'DOWN,RIGHT,LEFT,DOWN,RIGHT,LEFT', 'Comunicação', 'Bosque Perdido', 'Melodia alegre tocada por Saria que guia viajantes pelos caminhos do Bosque Perdido.'),
          ('Epona''s Song', 'UP,LEFT,RIGHT,UP,LEFT,RIGHT', 'Chamar Epona', 'Rancho Lon Lon', 'Canção ensinada por Malon que chama a égua Epona em qualquer campo aberto de Hyrule.'),
          ('Sun''s Song', 'RIGHT,DOWN,UP,RIGHT,DOWN,UP', 'Dia e Noite', 'Tumba Real', 'Alterna instantaneamente entre o amanhecer e o anoitecer, além de paralisar ReDeads.')
      `)
    }

    console.log("Banco sincronizado com sucesso (coluna icone e tabela musicas prontas).")
  } catch (err) {
    console.error("Erro ao sincronizar banco:", err)
  }
}

const PORT = process.env.PORT || 3000
initDb().then(() => {
  app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))
})