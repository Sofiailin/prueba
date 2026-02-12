import { Router } from 'express';
import * as petController from '../controllers/pet.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/auth';

const router = Router();

// VER (Todos logueados)
router.get('/', authenticate, petController.getPets);

// CREAR (Admin y Vet)
router.post('/', authenticate, authorize([UserRole.ADMIN, UserRole.VETERINARIO]), petController.createPet);

// MODIFICAR (Admin y Vet)
router.patch('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.VETERINARIO]), petController.updatePet);

// ELIMINAR (Admin y Vet)
router.delete('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.VETERINARIO]), petController.deletePet);

export default router;