import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  nombre: string;
  especie: string;
  edad: number;
  duenioId: mongoose.Types.ObjectId;
  veterinarioId: mongoose.Types.ObjectId;
}

const petSchema = new Schema<IPet>({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  edad: { type: Number, required: true },
  duenioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  veterinarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Pet = mongoose.models.Pet || mongoose.model<IPet>('Pet', petSchema);