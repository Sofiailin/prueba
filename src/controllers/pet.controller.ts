import { Request, Response } from 'express';
import { Pet } from '../models/Pet';
import { UserRole } from '../types/auth';

export const getPets = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    const filter: any = {};

    if (role === UserRole.DUENIO) filter.duenioId = id;
    if (role === UserRole.VETERINARIO) filter.veterinarioId = id;

    const pets = await Pet.find(filter).populate('duenioId', 'username email');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mascotas' });
  }
};

export const createPet = async (req: Request, res: Response) => {
  try {
    const newPet = new Pet({ ...req.body, veterinarioId: req.user!.id });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear' });
  }
};

export const updatePet = async (req: Request, res: Response) => {
  try {
    const query: any = { _id: req.params.id };
    if (req.user!.role === UserRole.VETERINARIO) query.veterinarioId = req.user!.id;

    const updated = await Pet.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) return res.status(403).json({ mensaje: 'No autorizado o no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  try {
    const query: any = { _id: req.params.id };
    if (req.user!.role === UserRole.VETERINARIO) query.veterinarioId = req.user!.id;

    const deleted = await Pet.findOneAndDelete(query);
    if (!deleted) return res.status(403).json({ mensaje: 'No autorizado' });
    res.json({ mensaje: 'Mascota eliminada' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar' });
  }
};