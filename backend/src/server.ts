import "dotenv/config"
import app from "./app.js"
import { pool } from "./config/database.js"

app.get('/', (_req, res) => {
  res.status(200).json({
    nome: 'Hyrule API',
    status: 'online',
    health: '/api/health',
  });
});


async function initDb(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personagens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        raca VARCHAR(80) NOT NULL,
        papel VARCHAR(80) NOT NULL,
        local VARCHAR(120) NOT NULL,
        descricao TEXT NOT NULL,
        nivel_poder INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(60) NOT NULL,
        icone VARCHAR(40)
      );
    `)

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

    const { rows } = await pool.query<{ total: number }>("SELECT COUNT(*)::int AS total FROM musicas")
    if (rows[0]?.total === 0) {
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

    console.log("Banco sincronizado com sucesso.")
  } catch (err) {
    console.error("Erro ao sincronizar banco:", err)
  }
}

const PORT = Number(process.env.PORT || 3000)

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`)
  })
})