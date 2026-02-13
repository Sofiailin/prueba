import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserRole } from '../types/auth';

export const getDuenios = async (req: Request, res: Response) => {
    try {
        // Busca solo los usuarios con rol DUENIO
        const duenios = await User.find({ role: UserRole.DUENIO }).select('_id username email');
        res.json(duenios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener dueños" });
    }
};