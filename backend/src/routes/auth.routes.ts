import { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Helper para capturar erros async e passar para middleware de erro
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/login', asyncHandler((req, res, next) => authController.login(req, res)));
router.post('/register', asyncHandler((req, res, next) => authController.register(req, res)));
router.post('/logout', asyncHandler((req, res, next) => authController.logout(req, res)));
router.post('/change-password', asyncHandler((req, res, next) => authController.changePassword(req, res)));
router.post('/recover-password', asyncHandler((req, res, next) => authController.recoverPassword(req, res)));

export const authRoutes = router;