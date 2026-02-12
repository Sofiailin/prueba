import { Request, Response } from 'express';
import * as petService from '../services/pet.service';
import { validationResult } from 'express-validator';
// Usamos el modelo para operaciones directas si es necesario
import { Pet } from '../models/pet'; 

export const getPets = async (req: Request, res: Response) => {
  try {
    const reqAny = req as any;
    if (!reqAny.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userId = reqAny.user.id;
    const userRole = reqAny.user.role; 

    // El servicio ahora maneja la lógica de quién ve qué
    const pets = await petService.getAllPets(userId, userRole);
    return res.json(pets);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener mascotas' });
  }
};

export const createPet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, especie, edad, duenioId } = req.body;
    const reqAny = req as any;
    const veterinarioId = reqAny.user.id; // El que carga la mascota es el veterinario logueado

    if (!duenioId) {
       return res.status(400).json({ error: 'Falta el ID del dueño' });
    }

    const newPetId = await petService.createPet(nombre, especie, edad, duenioId, veterinarioId);
    return res.status(201).json({ message: 'Mascota creada exitosamente', id: newPetId });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al crear la mascota' });
  }
};

export const updatePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqAny = req as any; 
    const userId = reqAny.user.id;
    const role = reqAny.user.role;

    // Lógica de seguridad: Admin puede todo, Vet solo lo suyo
    const filtro: any = { _id: id };
    if (role !== 'admin') {
        filtro.veterinarioId = userId;
    }

    const pet = await Pet.findOneAndUpdate(filtro, req.body, { new: true });

    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada o sin permisos' });
    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar' });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqAny = req as any;
    const userId = reqAny.user.id;
    const role = reqAny.user.role;

    const filtro: any = { _id: id };
    if (role !== 'admin') {
        filtro.veterinarioId = userId;
    }

    const pet = await Pet.findOneAndDelete(filtro);

    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada o sin permisos' });
    return res.json({ message: 'Mascota eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar' });
  }
};