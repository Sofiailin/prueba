import { Router } from 'express';
import { getPets, createPet, updatePet, deletePet } from '../controllers/pet.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/auth';

const router = Router();

router.use(authenticate);

router.get('/', getPets);
// Solo Admin y Veterinario pueden crear, editar o borrar
router.post('/', authorize([UserRole.ADMIN, UserRole.VETERINARIO]), createPet);
router.patch('/:id', authorize([UserRole.ADMIN, UserRole.VETERINARIO]), updatePet);
router.delete('/:id', authorize([UserRole.ADMIN, UserRole.VETERINARIO]), deletePet);

export default router;