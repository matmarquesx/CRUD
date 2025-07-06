# 📌 CRUD - Aplicação Web Completa com Autenticação e Gestão de Tarefas

Sistema fullstack desenvolvido em **TypeScript**, com **autenticação robusta** e funcionalidades completas de **CRUD de tarefas**. Arquitetura dividida em **Backend (API REST)** e **Frontend (interface web)**, voltada para fins **acadêmicos e didáticos**.

---

## ⚙️ Tecnologias Utilizadas

### 🧩 Backend
- **TypeScript** – Linguagem principal.
- **Node.js + Express** – API REST.
- **PostgreSQL** – Banco de dados relacional.
- **Prisma ORM** – Mapeamento objeto-relacional.
- **JWT** – Autenticação via token.
- **bcrypt** – Criptografia de senhas.
- **dotenv, cors, helmet** – Segurança e configuração.
- **yup / express-validator** – Validação de dados.

### 🎨 Frontend
- **TypeScript + React** – SPA moderna.
- **React Router DOM** – Roteamento.
- **Axios** – Requisições HTTP.
- **Context API** – Gerenciamento de estado.

---

## 🔐 Funcionalidades

### Autenticação
- Cadastro restrito a administradores.
- Login com JWT.
- Logout seguro.
- Bloqueio após 3 falhas de login.
- Contador de acessos.
- Alteração e recuperação de senha.

### Tarefas (CRUD)
- Criação, leitura, atualização e exclusão.
- Paginação de resultados.
- Vínculo de tarefas ao usuário criador.

---

## 📁 Estrutura do Projeto

<details>
<summary><strong>backend/</strong> – API REST Node.js/Express</summary>
backend/
├── prisma/
│ ├── migrations/
│ └── schema.prisma
├── scripts/
│ └── create-admin.js
├── src/
│ ├── @types/express/
│ ├── controllers/
│ ├── middlewares/
│ ├── routes/
│ ├── app.ts
│ └── server.ts
├── .env
├── package.json
├── tsconfig.json

</details>

<details>
<summary><strong>frontend/</strong> – Interface Web React/TypeScript</summary>

frontend/
├── public/
│ ├── index.html
│ └── ...
├── src/
│ ├── contexts/
│ ├── pages/
│ ├── services/
│ ├── styles/
│ ├── App.tsx
│ ├── index.tsx
│ └── ...
├── package.json
├── tsconfig.json

</details>

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (v14+)
- PostgreSQL
- npm ou yarn

### 🔧 Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```

⚠️ Configure o arquivo .env com DATABASE_URL e JWT_SECRET.

### 🎯 Frontend

```bash
cd frontend
npm install
npm start
```


## 👤 Primeiro Acesso (Criar Admin)
Com backend rodando, execute:

```bash
cd backend
node scripts/create-admin.js
```

Siga as instruções no terminal para cadastrar o primeiro administrador.

Acesse: http://localhost:3000.

## 👥 Tipos e Status de Usuário

| Tipo | Descrição                   |
| ---- | --------------------------- |
| `0`  | Administrador (pode tudo)   |
| `1`  | Usuário comum (só próprias) |

| Status | Significado                              |
| ------ | ---------------------------------------- |
| `A`    | Ativo (acesso liberado)                  |
| `I`    | Inativo (bloqueado manualmente)          |
| `B`    | Bloqueado (falhas de login consecutivas) |

## 🔌 Endpoints da API
/auth
POST /auth/register – Criar usuário (admin)

POST /auth/login – Login e JWT

POST /auth/logout – Logout

PUT /auth/password – Alterar senha

POST /auth/recover – Recuperar senha

/tarefas
POST /tarefas – Criar tarefa

GET /tarefas?page=1&limit=10 – Listar tarefas paginadas

PUT /tarefas/:id – Atualizar tarefa

DELETE /tarefas/:id – Remover tarefa

## 📄 Licença
Este projeto foi desenvolvido com fins acadêmicos e educacionais.
