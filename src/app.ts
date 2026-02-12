import express from 'express';
import cors from 'cors';
import path from 'path';

// Importación de Rutas
import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import historialmRoutes from './routes/historialm.routes';
import userRoutes from './routes/user.routes'; // ACTIVADO

// Importación del Middleware de Errores
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// --- 1. Middlewares Globales ---
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Frontend)
// Nota: Se usa 'Public' con mayúscula según la estructura de tu proyecto
app.use(express.static(path.join(__dirname, '..', 'Public')));

// --- 2. Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/historialm', historialmRoutes);
app.use('/api/users', userRoutes); // ACTIVADO para que el modal cargue los dueños

// Ruta de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Backend MVC funcionando perfecto! 🚀' });
});

// --- 3. Middleware de Errores (SIEMPRE AL FINAL) ---
app.use(errorHandler);

export default app;