export interface CreatePetDTO {
  nombre: string;
  especie: string;
  edad: number;
  duenioId: string;
}

export interface UpdatePetDTO {
  nombre?: string;
  especie?: string;
  edad?: number;
}