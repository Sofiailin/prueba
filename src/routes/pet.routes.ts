import { Router } from 'express';
import { getPets, createPet, updatePet, deletePet } from '../controllers/pet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Todas las rutas requieren token

router.get('/', getPets);
router.post('/', createPet);
router.patch('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
