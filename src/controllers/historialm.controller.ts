import { Request, Response } from 'express';
import { validationResult } from 'express-validator'; // Requisito obligatorio 
import { HistorialM } from '../models/HistorialM'; 
import { Pet } from '../models/pet'; // Asegúrate que coincida con el nombre del archivo real 

// CREAR REGISTRO (Solo Veterinarios)
export const createEntry = async (req: Request, res: Response) => {
  try {
    // 1. Manejo centralizado de errores de validación [cite: 153, 155]
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reqAny = req as any;
    const { petId, descripcion, diagnostico, tratamiento } = req.body;

    // 2. Verificación de existencia de la entidad relacionada [cite: 140]
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    const newEntry = new HistorialM({
      mascota: petId,
      veterinario: reqAny.user.id, // ID obtenido del JWT [cite: 154]
      descripcion,
      diagnostico,
      tratamiento
    });

    await newEntry.save();
    return res.status(201).json(newEntry);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear historial' });
  }
};

// VER HISTORIAL DE UNA MASCOTA
export const getHistoryByPet = async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const reqAny = req as any;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });

    // 3. Validación de seguridad y roles (Requisito de seguridad) [cite: 174, 183]
    // Un dueño solo puede ver el historial si la mascota le pertenece 
    if (reqAny.user.role === 'duenio' && pet.duenio.toString() !== reqAny.user.id) {
      return res.status(403).json({ error: 'No tenés permiso para ver este historial' });
    }

    // 4. Obtención de detalles con población de datos [cite: 190]
    const history = await HistorialM.find({ mascota: petId })
      .populate('veterinario', 'username email') // Muestra quién atendió a la mascota [cite: 138]
      .sort({ fecha: -1 });

    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener historial' });
  }
};