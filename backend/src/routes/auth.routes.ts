import { Router } from 'express';

const router = Router();

// Exemplo de rota de login
router.post('/login', (req, res) => {
  // Lógica de autenticação aqui
  res.json({ message: 'Login realizado com sucesso!' });
});

// Exemplo de rota de registro
router.post('/register', (req, res) => {
  // Lógica de registro aqui
  res.json({ message: 'Usuário registrado com sucesso!' });
});

export const authRoutes = router;