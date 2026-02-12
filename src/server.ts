import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { connectDB } from './config/database';

// Importar rutas
import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import userRoutes from './routes/user.routes'; // Si no tenés este, borra esta línea

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS: Permite que el botón funcione
app.use(cors());

// 2. JSON: Entiende los datos del login
app.use(express.json());

// 3. Base de Datos
connectDB();

// 4. Rutas (Fijate que dicen /api)
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes); // Borra si no usas users

// 5. Frontend (Archivos públicos)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
    console.log(`🚀 Veterinaria corriendo en http://localhost:${PORT}`);
});