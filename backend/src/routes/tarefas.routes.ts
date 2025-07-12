import { Router, Request, Response, NextFunction } from 'express';
import { TarefasController } from '../controllers/tarefas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const tarefasController = new TarefasController();

// Handler genérico para funções async
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => any
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authMiddleware, asyncHandler((req, res) => tarefasController.list(req, res)));
router.get('/:id', authMiddleware, asyncHandler((req, res) => tarefasController.getById(req, res)));
router.post('/', authMiddleware, asyncHandler((req, res) => tarefasController.create(req, res)));
router.put('/:id', authMiddleware, asyncHandler((req, res) => tarefasController.update(req, res)));
router.delete('/:id', authMiddleware, asyncHandler((req, res) => tarefasController.delete(req, res)));

export const tarefasRoutes = router;