import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface para o corpo da requisição de criação/atualização de tarefa
interface TarefaRequest {
  titulo: string;
  descricao: string;
  concluida?: boolean;
}

// Controlador de tarefas
export class TarefasController {
  // Criar tarefa
  async create(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const { titulo, descricao, concluida } = req.body as TarefaRequest;
      const username = req.usuario.username;

      // Criar tarefa associada ao usuário
      const tarefa = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          concluida: concluida || false,
          usuario_username: username
        }
      });

      return res.status(201).json({
        message: 'Tarefa criada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Listar tarefas com paginação
  async list(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const username = req.usuario.username;
      const page = Number(req.query.page) || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      // Buscar tarefas do usuário com paginação
      const tarefas = await prisma.tarefa.findMany({
        where: {
          usuario_username: username
        },
        skip,
        take: pageSize,
        orderBy: {
          data_criacao: 'desc'
        }
      });

      // Contar total de tarefas para paginação
      const total = await prisma.tarefa.count({
        where: {
          usuario_username: username
        }
      });

      return res.json({
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
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Atualizar tarefa
  async update(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const { id } = req.params;
      const { titulo, descricao, concluida } = req.body as TarefaRequest;
      const username = req.usuario.username;

      // Verificar se a tarefa existe e pertence ao usuário
      const existingTarefa = await prisma.tarefa.findUnique({
        where: { id: Number(id) }
      });

      if (!existingTarefa) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      if (existingTarefa.usuario_username !== username) {
        return res.status(403).json({ message: 'Você não tem permissão para atualizar esta tarefa' });
      }

      // Atualizar tarefa
      const updatedTarefa = await prisma.tarefa.update({
        where: { id: Number(id) },
        data: {
          titulo,
          descricao,
          concluida: concluida !== undefined ? concluida : existingTarefa.concluida
        }
      });

      return res.json({
        message: 'Tarefa atualizada com sucesso',
        tarefa: updatedTarefa
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Deletar tarefa
  async delete(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const { id } = req.params;
      const username = req.usuario.username;

      // Verificar se a tarefa existe e pertence ao usuário
      const existingTarefa = await prisma.tarefa.findUnique({
        where: { id: Number(id) }
      });

      if (!existingTarefa) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      if (existingTarefa.usuario_username !== username) {
        return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa' });
      }

      // Deletar tarefa
      await prisma.tarefa.delete({
        where: { id: Number(id) }
      });

      return res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
