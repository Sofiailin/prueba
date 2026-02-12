import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getDuenios } from '../controllers/user.controller';

const router = Router();

// Ruta: /api/users/duenios
router.get('/duenios', authenticate, getDuenios);

export default router;