import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config'; 

// Importación de Rutas
import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import historialmRoutes from './routes/historialm.routes';

// Importación del Middleware de Errores
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// --- 1. Middlewares Globales ---
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Frontend)
// Nota: Asegúrate de renombrar tu carpeta 'Publico' a 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- 2. Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/historialm', historialmRoutes);

// Ruta de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Backend MVC funcionando perfecto! 🚀' });
});

// --- 3. Middleware de Errores (SIEMPRE AL FINAL) ---
app.use(errorHandler);

export default app;