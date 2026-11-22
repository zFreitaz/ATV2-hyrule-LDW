CREATE DATABASE hyrule;
\c hyrule

CREATE TABLE personagens (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  raca        VARCHAR(20)  NOT NULL,
  papel       VARCHAR(20)  NOT NULL,
  local       VARCHAR(100) NOT NULL,
  descricao   TEXT         NOT NULL,
  nivel_poder INTEGER      NOT NULL CHECK (nivel_poder BETWEEN 0 AND 100),
  status      VARCHAR(20)  NOT NULL
);

INSERT INTO personagens (nome, raca, papel, local, descricao, nivel_poder, status) VALUES
('Link', 'Hylian', 'Herói', 'Floresta Kokiri', 'Jovem escolhido pela Master Sword para derrotar Ganondorf.', 80, 'Ativo'),
('Zelda', 'Hylian', 'Sábio', 'Castelo de Hyrule', 'Princesa de Hyrule e portadora da Triforce da Sabedoria.', 85, 'Ativo'),
('Ganondorf', 'Gerudo', 'Vilão', 'Castelo do Ganon', 'Rei dos Gerudo que busca a Triforce completa.', 98, 'Derrotado'),
('Saria', 'Kokiri', 'Sábio', 'Bosque Perdido', 'Melhor amiga de Link e Sábia da Floresta.', 60, 'Ativo'),
('Darunia', 'Goron', 'Sábio', 'Cidade Goron', 'Líder dos Gorons e Sábio do Fogo.', 70, 'Ativo');