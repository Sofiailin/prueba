import { Pet } from '../models/Pet'; // Asegúrate que la mayúscula coincida con tu archivo
import { UserRole } from '../types/auth';

// OBTENER MASCOTAS (Lógica de permisos)
export const getAllPets = async (userId: string, role: UserRole) => {
  const populateOptions = [
    { path: 'duenioId', select: 'username email' },
    { path: 'veterinarioId', select: 'username email' }
  ];

  // 1. ADMIN: Ve todo
  if (role === UserRole.ADMIN) {
    return await Pet.find().populate(populateOptions);
  }

  // 2. VETERINARIO: Ve solo las que él cargó (veterinarioId)
  if (role === UserRole.VETERINARIO) {
    return await Pet.find({ veterinarioId: userId }).populate(populateOptions);
  }

  // 3. DUEÑO: Ve solo las suyas (duenioId)
  // Como arreglamos el modelo, esto ahora sí funcionará
  return await Pet.find({ duenioId: userId }).populate(populateOptions);
};

// CREAR MASCOTA
export const createPet = async (nombre: string, especie: string, edad: number, duenioId: string, veterinarioId: string) => {
  const newPet = new Pet({
    nombre,
    especie,
    edad,
    duenioId,      // Ahora coincide con el modelo
    veterinarioId
  });
  return await newPet.save();
};