import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TarefaRequest {
  titulo: string;
  descricao: string;
  concluida?: boolean;
}

export class TarefasController {
  async create(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { titulo, descricao, concluida } = req.body as TarefaRequest;
      const username = req.usuario.username;

      const tarefa = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          concluida: concluida || false,
          usuario_username: username
        }
      });

      res.status(201).json({
        message: 'Tarefa criada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const username = req.usuario.username;
      const page = Number(req.query.page) || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      const tarefas = await prisma.tarefa.findMany({
        where: { usuario_username: username },
        skip,
        take: pageSize,
        orderBy: { data_criacao: 'desc' }
      });

      const total = await prisma.tarefa.count({
        where: { usuario_username: username }
      });

      res.json({
        tarefas,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }
      const { id } = req.params;
      const username = req.usuario.username;
      const tarefa = await prisma.tarefa.findUnique({ where: { id: Number(id) } });
      if (!tarefa) {
        res.status(404).json({ message: 'Tarefa não encontrada' });
        return;
      }
      if (tarefa.usuario_username !== username) {
        res.status(403).json({ message: 'Você não tem permissão para ver esta tarefa' });
        return;
      }
      res.json({ tarefa });
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { id } = req.params;
      const { titulo, descricao, concluida } = req.body as TarefaRequest;
      const username = req.usuario.username;

      const existingTarefa = await prisma.tarefa.findUnique({
        where: { id: Number(id) }
      });

      if (!existingTarefa) {
        res.status(404).json({ message: 'Tarefa não encontrada' });
        return;
      }

      if (existingTarefa.usuario_username !== username) {
        res.status(403).json({ message: 'Você não tem permissão para atualizar esta tarefa' });
        return;
      }

      const updatedTarefa = await prisma.tarefa.update({
        where: { id: Number(id) },
        data: {
          titulo,
          descricao,
          concluida: concluida !== undefined ? concluida : existingTarefa.concluida
        }
      });

      res.json({
        message: 'Tarefa atualizada com sucesso',
        tarefa: updatedTarefa
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const { id } = req.params;
      const username = req.usuario.username;

      const existingTarefa = await prisma.tarefa.findUnique({
        where: { id: Number(id) }
      });

      if (!existingTarefa) {
        res.status(404).json({ message: 'Tarefa não encontrada' });
        return;
      }

      if (existingTarefa.usuario_username !== username) {
        res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa' });
        return;
      }

      await prisma.tarefa.delete({
        where: { id: Number(id) }
      });

      res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}