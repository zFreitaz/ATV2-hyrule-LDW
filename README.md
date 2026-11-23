# Hyrule — Arquivos do Tempo (LDW AT2)

Aplicação web SPA temática inspirada em **The Legend of Zelda: Ocarina of Time**, desenvolvida com React, TypeScript, Tailwind CSS e shadcn/ui, integrada a uma API RESTful em Node.js, Express e PostgreSQL.

## Funcionalidades

- **CRUD Completo de Personagens:** Listagem com contadores, busca por nome/local, filtro por papel, ordenação, cadastro, edição com seleção de emblemas SVG temáticos e exclusão com modal de confirmação.
- **CRUD de Melodias da Ocarina:** Cadastro, edição, reprodução sonora e exclusão de músicas com sequências de notas.
- **Ocarina Interativa (Web Audio API):** Teclado musical sintetizado diretamente no navegador que reconhece melodias cadastradas e dispara efeitos visuais na interface.
- **Feedback Visual:** Estados de carregamento (`Skeleton`), estados vazios e notificações flutuantes (`Sonner`).

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router DOM, Lucide React
- **Backend:** Node.js, Express, PostgreSQL (`pg`), CORS, dotenv

## Estrutura do Projeto

    ATV2-hyrule-LDW/
    ├── app/        # Frontend SPA (React + TypeScript + shadcn/ui)
    └── backend/    # API RESTful (Node.js + Express + PostgreSQL)

## Como Executar o Projeto

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL em execução (local ou Supabase)

### 2. Configurar e Iniciar o Backend

    cd backend
    pnpm install
    cp .env.example .env
    # Preencha as credenciais do PostgreSQL no arquivo .env
    pnpm dev

A API será iniciada em `http://localhost:3000` e sincronizará automaticamente as tabelas `personagens` e `musicas`.

### 3. Configurar e Iniciar o Frontend

    cd app
    pnpm install
    cp .env.example .env
    pnpm dev

Acesse a aplicação no navegador em `http://localhost:5173`.