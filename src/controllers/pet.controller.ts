import { Request, Response } from 'express';
import { Pet } from '../models/Pet';

export const getPets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const filter: Record<string, string> = {};

    if (role === 'duenio') {
      filter.duenioId = userId as string;
    }

    if (role === 'veterinario') {
      filter.veterinarioId = userId as string;
    }

    const pets = await Pet.find(filter).populate('duenioId veterinarioId');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mascotas' });
  }
};

export const createPet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === 'duenio') {
      return res.status(403).json({ mensaje: 'No autorizado para crear mascotas' });
    }

    const veterinarioId = role === 'admin' ? req.body.veterinarioId || userId : userId;
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

    if (role === 'duenio') {
      return res.status(403).json({ mensaje: 'No autorizado para editar mascotas' });
    }

    const query: any = { _id: id };
    if (role === 'veterinario') {
      query.veterinarioId = userId as string;
    }

    const updated = await Pet.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) {
      return res.status(403).json({ mensaje: 'No autorizado o no encontrado' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar' });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === 'duenio') {
      return res.status(403).json({ mensaje: 'No autorizado para eliminar mascotas' });
    }

    const query: any = { _id: id };
    if (role === 'veterinario') {
      query.veterinarioId = userId as string;
    }

    const deleted = await Pet.findOneAndDelete(query);
    if (!deleted) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    res.json({ mensaje: 'Mascota eliminada' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar' });
  }
};
