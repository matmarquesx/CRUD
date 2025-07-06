import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface para o payload do token JWT
interface TokenPayload {
  username: string;
  tipo: string;
}

// Interface para estender o objeto Request do Express
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
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

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

      // Adiciona informações do usuário ao objeto de requisição
      req.usuario = {
        username: decoded.username,
        tipo: decoded.tipo
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

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
