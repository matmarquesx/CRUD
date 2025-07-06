import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterRequest {
  username: string;
  password: string;
  nome: string;
  tipo: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

interface RecoverRequest {
  username: string;
}

export class AuthController {
  constructor() {
    this.criarUsuarioAdminPadrao();
  }

  private async criarUsuarioAdminPadrao() {
    try {
      const existe = await prisma.usuario.findUnique({ where: { username: 'admin' } });
      if (!existe) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await prisma.usuario.create({
          data: {
            username: 'admin',
            password: hashedPassword,
            nome: 'Administrador',
            tipo: '0',
            status: 'A',
            quant_acesso: 0
          }
        });
        console.log('Usuário admin criado: admin/admin');
      }
    } catch (error) {
      console.error('Erro ao criar usuário admin padrão:', error);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password, nome, tipo } = req.body as RegisterRequest;
      if (!username || !password || !nome || !tipo) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
      }

      const existingUser = await prisma.usuario.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.usuario.create({
        data: {
          username,
          password: hashedPassword,
          nome,
          tipo,
          status: 'A',
          quant_acesso: 0
        }
      });

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body as LoginRequest;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username e senha obrigatórios' });
      }

      const user = await prisma.usuario.findUnique({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      if (user.status === 'B') {
        return res.status(403).json({ message: 'Usuário bloqueado' });
      }
      if (user.status !== 'A') {
        return res.status(403).json({ message: 'Usuário inativo' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Simulação de bloqueio após falhas (exemplo didático)
        if (Math.random() < 0.3) {
          await prisma.usuario.update({
            where: { username },
            data: { status: 'B' }
          });
          return res.status(403).json({
            message: 'Conta bloqueada após múltiplas tentativas incorretas. Entre em contato com o administrador.'
          });
        }

        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      await prisma.usuario.update({
        where: { username },
        data: { quant_acesso: user.quant_acesso + 1 }
      });

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET não definido');

      const token = jwt.sign(
        { username: user.username, tipo: user.tipo },
        secret,
        { expiresIn: '1h' }
      );

      return res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          username: user.username,
          nome: user.nome,
          tipo: user.tipo,
          quant_acesso: user.quant_acesso + 1
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async logout(req: Request, res: Response) {
    return res.json({ message: 'Logout realizado com sucesso' });
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userSession = req.usuario;  // Middleware deve popular req.usuario
      if (!userSession) return res.status(401).json({ message: 'Usuário não autenticado' });

      const { oldPassword, newPassword } = req.body as PasswordChangeRequest;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
      }

      const user = await prisma.usuario.findUnique({ where: { username: userSession.username } });
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Senha atual incorreta' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.usuario.update({
        where: { username: user.username },
        data: { password: hashedPassword }
      });

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async recoverPassword(req: Request, res: Response) {
    try {
      const { username } = req.body as RecoverRequest;
      if (!username) return res.status(400).json({ message: 'Username obrigatório' });

      const user = await prisma.usuario.findUnique({ where: { username } });
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      await prisma.usuario.update({
        where: { username },
        data: { password: hashedPassword }
      });

      return res.json({
        message: 'Uma nova senha foi enviada para o seu e-mail',
        tempPassword: process.env.NODE_ENV === 'development' ? tempPassword : undefined
      });
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export const authController = new AuthController();
