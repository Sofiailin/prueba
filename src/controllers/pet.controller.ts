import { Request, Response } from 'express';
import { Pet } from '../models/Pet';
import { UserRole } from '../types/auth';

export const getPets = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const filter: any = {};

        // Lógica de visualización según requerimiento:
        if (role === UserRole.DUENIO) {
            filter.duenioId = userId; // El dueño ve sus mascotas
        } else if (role === UserRole.VETERINARIO) {
            filter.veterinarioId = userId; // El veterinario ve lo que él cargó
        }
        // El admin no tiene filtro y ve todo

        const pets = await Pet.find(filter).populate('duenioId', 'username email');
        res.json(pets);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener mascotas' });
    }
};

export const createPet = async (req: Request, res: Response) => {
    try {
        const veterinarioId = req.user?.id; 
        // Aseguramos que el veterinarioId sea el del usuario logueado
        const newPet = new Pet({ ...req.body, veterinarioId });
        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear mascota' });
    }
};

export const updatePet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const role = req.user?.role;

        const query: any = { _id: id };
        // Si es veterinario, solo puede editar si él creó el registro
        if (role === UserRole.VETERINARIO) query.veterinarioId = userId;

        const updated = await Pet.findOneAndUpdate(query, req.body, { new: true });
        if (!updated) return res.status(403).json({ mensaje: 'No autorizado o no encontrado' });
        
        res.json(updated);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar' });
    }
};

export const deletePet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const query: any = { _id: id };
        if (req.user?.role === UserRole.VETERINARIO) query.veterinarioId = req.user.id;

        const deleted = await Pet.findOneAndDelete(query);
        if (!deleted) return res.status(403).json({ mensaje: 'No autorizado o no encontrado' });

        res.json({ mensaje: 'Mascota eliminada' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar' });
    }
};