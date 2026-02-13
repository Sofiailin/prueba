import { Router } from 'express';
import { getPets, createPet, updatePet, deletePet } from '../controllers/pet.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/auth';

const router = Router();

// Todas las rutas requieren estar logueado
router.use(authenticate); 

// Todos pueden ver (la lógica de qué ve cada uno va en el controlador)
router.get('/', getPets);

// Solo veterinarios y admins pueden agregar
router.post('/', authorize([UserRole.VETERINARIO, UserRole.ADMIN]), createPet);

// Solo veterinarios y admins pueden modificar o eliminar
router.patch('/:id', authorize([UserRole.VETERINARIO, UserRole.ADMIN]), updatePet);
router.delete('/:id', authorize([UserRole.VETERINARIO, UserRole.ADMIN]), deletePet);

export default router;