# CRUD

Este projeto implementa uma aplicação web completa em TypeScript com CRUD e autenticação de usuário, seguindo especificações acadêmicas.

## Tecnologias Utilizadas

### Backend
- TypeScript
- Node.js com Express
- PostgreSQL
- Prisma ORM
- JWT (autenticação)
- bcrypt (criptografia de senha)
- dotenv (variáveis de ambiente)

### Frontend
- TypeScript
- React
- Axios (requisições HTTP)
- React Router (navegação)
- Context API (gerenciamento de estado)

## Funcionalidades

### Autenticação
- Cadastro de usuário (restrito a administradores)
- Login com JWT
- Logout
- Bloqueio após 3 tentativas erradas consecutivas
- Contador de acessos
- Alteração de senha
- Recuperação de senha

### CRUD de Tarefas
- Criação de tarefas
- Listagem com paginação
- Atualização de tarefas
- Exclusão de tarefas
- Relacionamento com usuário

## Estrutura do Projeto

```
typescript-crud-auth/
├── backend/               # API REST em Node.js/Express/TypeScript
│   ├── src/
│   │   ├── controllers/   # Controladores da aplicação
│   │   ├── middlewares/   # Middlewares de autenticação e autorização
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Lógica de negócio
│   │   ├── utils/         # Funções utilitárias
│   │   ├── prisma/        # Configuração do Prisma ORM
│   │   │   └── schema.prisma
│   │   └── server.ts      # Ponto de entrada da aplicação
│   ├── .env               # Variáveis de ambiente
│   └── package.json       # Dependências do backend
│
└── frontend/              # Interface web em React/TypeScript
    ├── public/            # Arquivos estáticos
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── contexts/      # Contextos React (autenticação)
    │   ├── pages/         # Páginas da aplicação
    │   ├── services/      # Serviços para comunicação com API
    │   ├── styles/        # Estilos CSS
    │   ├── types/         # Definições de tipos TypeScript
    │   ├── utils/         # Funções utilitárias
    │   └── App.tsx        # Componente principal
    └── package.json       # Dependências do frontend
```

## Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL
- npm ou yarn

### Backend

1. Navegue até a pasta do backend:
```bash
cd typescript-crud-auth/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Ajuste as configurações de banco de dados e JWT

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd typescript-crud-auth/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Uso da Aplicação

### Primeiro Acesso
1. Crie um usuário administrador diretamente no banco de dados:
```sql
INSERT INTO usuarios (username, password, nome, tipo, status, quant_acesso)
VALUES ('admin', '$2b$10$...', 'Administrador', '0', 'A', 0);
```
Obs: A senha deve ser criptografada com bcrypt. Use o script `create-admin.js` na pasta `scripts` para gerar um hash.

2. Acesse a aplicação em `http://localhost:3000`
3. Faça login com o usuário administrador
4. Use a interface para cadastrar novos usuários e gerenciar tarefas

### Tipos de Usuário
- **Administrador (tipo '0')**: Pode cadastrar novos usuários e gerenciar tarefas
- **Usuário comum (tipo '1')**: Pode apenas gerenciar suas próprias tarefas

### Status de Usuário
- **A**: Ativo (pode acessar o sistema)
- **I**: Inativo (acesso bloqueado)
- **B**: Bloqueado (após 3 tentativas incorretas de login)

## Endpoints da API

### Autenticação
- `POST /auth/register` - Cadastro de usuário (requer admin)
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `PUT /auth/password` - Alteração de senha
- `POST /auth/recover` - Recuperação de senha

### Tarefas
- `POST /tarefas` - Criar tarefa
- `GET /tarefas?page=1` - Listar tarefas com paginação
- `PUT /tarefas/:id` - Atualizar tarefa
- `DELETE /tarefas/:id` - Deletar tarefa

## Licença
Este projeto é para fins acadêmicos.
