# Hyrule — Arquivos do Tempo (LDW AT2 & IEC AT2)

Aplicação web SPA temática inspirada em **The Legend of Zelda: Ocarina of Time**, desenvolvida com React, TypeScript, Tailwind CSS e shadcn/ui, integrada a uma API RESTful em Node.js, Express e PostgreSQL com esteira de CI/CD automatizada via Docker, GitHub Actions e Render.

## API em Produção (Render)

- **URL Base da API:** https://atv2-hyrule-ldw.onrender.com
- **Health Check:** https://atv2-hyrule-ldw.onrender.com/api/health
- **Endpoints Principais:** `/personagens`, `/musicas`

## Funcionalidades

- **CRUD Completo de Personagens:** Listagem com contadores, busca por nome/local, filtro por papel, ordenação, cadastro, edição com seleção de emblemas SVG temáticos e exclusão com modal de confirmação.
- **CRUD de Melodias da Ocarina:** Cadastro, edição, reprodução sonora e exclusão de músicas com sequências de notas.
- **Ocarina Interativa (Web Audio API):** Teclado musical sintetizado diretamente no navegador que reconhece melodias cadastradas e dispara efeitos visuais na interface.
- **Pipeline de CI/CD:** Validação de tipagem (`tsc`), build de produção, validação de imagem Docker e disparo automático de Deploy Hook no Render via GitHub Actions.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router DOM, Lucide React
- **Backend:** Node.js, Express, TypeScript, PostgreSQL (`pg`), CORS, dotenv
- **DevOps / CI/CD:** Docker, GitHub Actions, Render

## Estrutura do Projeto

    ATV2-hyrule-LDW/
    ├── .github/workflows/  # Pipeline de CI/CD (deploy.yml)
    ├── app/                # Frontend SPA (React + TypeScript + shadcn/ui)
    └── backend/            # API RESTful + Dockerfile de produção

## Como Executar o Projeto Localmente

### 1. Pré-requisitos

- Node.js 20+ e pnpm
- PostgreSQL em execução (local ou nuvem)

### 2. Configurar e Iniciar o Backend

    cd backend
    pnpm install
    cp .env.example .env
    # Preencha as credenciais do PostgreSQL (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL) no arquivo .env
    pnpm dev

A API será iniciada em `http://localhost:3000` e sincronizará automaticamente as tabelas `personagens` e `musicas`.

### 3. Executar via Docker (Backend)

    cd backend
    docker build -t hyrule-api .
    docker run -p 3000:3000 --env-file .env hyrule-api

### 4. Configurar e Iniciar o Frontend

    cd app
    pnpm install
    cp .env.example .env
    pnpm dev

Acesse a aplicação no navegador em `http://localhost:5173`.