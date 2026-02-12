import { Pet } from '../models/Pet';
import { UserRole } from '../types/auth'; // Asegúrate de tener definidos ADMIN, VETERINARIO, DUENIO

export const getAllPets = async (userId: string, role: string) => {
  const populateOptions = [
    { path: 'duenioId', select: 'username email' },
    { path: 'veterinarioId', select: 'username email' }
  ];

  // 1. ADMIN: Ve absolutamente todas las mascotas
  if (role === 'admin') {
    return await Pet.find().populate(populateOptions);
  }

  // 2. VETERINARIO: Ve solo las mascotas que él mismo dio de alta
  if (role === 'veterinario') {
    return await Pet.find({ veterinarioId: userId }).populate(populateOptions);
  }

  // 3. DUEÑO: Ve solo las mascotas que le pertenecen
  return await Pet.find({ duenioId: userId }).populate(populateOptions);
};