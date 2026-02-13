import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  nombre: string;
  especie: string;
  edad: number;
  duenioId: mongoose.Types.ObjectId;
  veterinarioId: mongoose.Types.ObjectId;
  descripcion: string;
  diagnostico: string;
  tratamiento: string;
}

const petSchema = new Schema<IPet>({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  edad: { type: Number, required: true },
  duenioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  veterinarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  descripcion: { type: String, default: "Chequeo general y vacunas anuales" },
  diagnostico: { type: String, default: "Paciente sano, peso ideal" },
  tratamiento: { type: String, default: "Se aplica vacuna sextuple. Próxima visita en 1 año." }
}, { timestamps: true });

export const Pet = mongoose.models.Pet || mongoose.model<IPet>('Pet', petSchema);