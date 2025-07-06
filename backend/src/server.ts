// Arquivo para configuração do servidor
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { authRoutes } from './routes/auth.routes';
import { tarefasRoutes } from './routes/tarefas.routes';

// Inicializa variáveis de ambiente
dotenv.config();

// Inicializa o Prisma
export const prisma = new PrismaClient();

// Inicializa o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/tarefas', tarefasRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API CRUD com Autenticação - Funcionando!' });
});

// Middleware de tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
