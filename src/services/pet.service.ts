import { Pet } from '../models/pet';
import { UserRole } from '../types/auth';

export const getAllPets = async (userId: string, role: UserRole) => {
  // IMPORTANTE: Asegurate que en tu modelo Pet el campo sea 'duenioId'
  const populateField = 'duenioId';

  if (role === UserRole.ADMIN) {
    return await Pet.find().populate(populateField, 'username email');
  }
  if (role === UserRole.VETERINARIO) {
    return await Pet.find({ veterinarioId: userId }).populate(populateField, 'username email');
  }
  // Dueño ve las suyas
  return await Pet.find({ duenioId: userId }).populate(populateField, 'username email');
};