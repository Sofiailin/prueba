// src/models/user.ts
import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types/auth';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.DUENIO
    },
  },
  { timestamps: true }
);

// EXPORTACIÓN NOMBRADA Y SEGURA (Esto evita el "Cannot read properties of undefined")
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// También exportamos las funciones por si las usas en otros lados
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const createUser = async (userData: Partial<IUser>) => {
  const newUser = new User(userData);
  return await newUser.save();
};