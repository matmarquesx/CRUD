import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { tarefasRoutes } from './routes/tarefas.routes';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app: Express = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(helmet()); // Segurança
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API CRUD com Autenticação - Funcionando!' });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/tarefas', tarefasRoutes);

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
