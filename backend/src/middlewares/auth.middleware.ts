import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TokenPayload {
  username: string;
  tipo: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        username: string;
        tipo: string;
      };
    }
  }
}

// Middleware para verificar autenticação
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const secret = process.env.JWT_SECRET || 'seu_segredo_jwt_super_seguro';

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Verificar se o usuário existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { username: decoded.username }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (usuario.status !== 'A') {
      return res.status(403).json({ message: 'Usuário inativo ou bloqueado' });
    }

    req.usuario = { username: decoded.username, tipo: decoded.tipo };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Middleware para verificar se o usuário é administrador
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  if (req.usuario.tipo !== '0') {
    return res.status(403).json({ message: 'Acesso restrito a administradores' });
  }

  return next();
};