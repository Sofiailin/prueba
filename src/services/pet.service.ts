import { Pet } from '../models/Pet';

export const getAllPets = async (userId: string, role: string) => {
    const populateFields = 'duenioId veterinarioId';
    if (role === 'admin') return await Pet.find().populate(populateFields);
    if (role === 'veterinario') return await Pet.find({ veterinarioId: userId }).populate(populateFields);
    // El dueño solo ve las mascotas asociadas a su duenioId
    return await Pet.find({ duenioId: userId }).populate(populateFields);
};

export const createPet = async (data: any) => {
    return await Pet.create(data);
};

export const updatePet = async (id: string, data: any, userId: string, role: string) => {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    
    // El veterinario solo modifica lo que él creó; el admin todo
    if (role !== 'admin' && pet.veterinarioId.toString() !== userId) {
        throw new Error('No tienes permiso para modificar esta mascota');
    }
    return await Pet.findByIdAndUpdate(id, data, { new: true });
};

export const deletePet = async (id: string, userId: string, role: string) => {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    
    if (role !== 'admin' && pet.veterinarioId.toString() !== userId) {
        throw new Error('No tienes permiso para eliminar esta mascota');
    }
    return await Pet.findByIdAndDelete(id);
};