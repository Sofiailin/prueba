import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialM extends Document {
  mascota: mongoose.Types.ObjectId;
  veterinario: mongoose.Types.ObjectId;
  fecha: Date;
  descripcion: string;
  diagnostico: string;
  tratamiento: string;
}

const HistorialMSchema = new Schema({
  mascota: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  veterinario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  descripcion: { type: String, required: true },
  diagnostico: { type: String },
  tratamiento: { type: String }
});
export const HistorialM =
  mongoose.models.HistorialM || mongoose.model<IHistorialM>('HistorialM', HistorialMSchema);