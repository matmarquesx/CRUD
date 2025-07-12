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

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    res.status(401).json({ message: 'Erro no formato do token' });
    return;
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ message: 'Formato de token inválido' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'seu_segredo_jwt_super_seguro';

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const usuario = await prisma.usuario.findUnique({
      where: { username: decoded.username }
    });

    if (!usuario) {
      res.status(401).json({ message: 'Usuário não encontrado' });
      return;
    }

    if (usuario.status !== 'A') {
      res.status(403).json({ message: 'Usuário inativo ou bloqueado' });
      return;
    }

    req.usuario = { username: decoded.username, tipo: decoded.tipo };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
}