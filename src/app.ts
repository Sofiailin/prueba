import express from 'express';
import cors from 'cors';
import path from 'path';

// Importación de Rutas
import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import historialmRoutes from './routes/historialm.routes';
// Si tienes una ruta de usuarios separada del auth, impórtala aquí:
// import userRoutes from './routes/user.routes'; 

// Importación del Middleware de Errores
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// --- 1. Middlewares Globales ---
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Frontend)
// CORRECCIÓN: Tu carpeta se llama 'Public' (con P mayúscula), así que ajusté el nombre aquí.
app.use(express.static(path.join(__dirname, '..', 'Public')));

// --- 2. Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/historialm', historialmRoutes);
// app.use('/api/users', userRoutes); // Descomentar si usas la ruta de usuarios

// Ruta de prueba para verificar que el backend responde
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Backend MVC funcionando perfecto! 🚀' });
});

// --- 3. Middleware de Errores (SIEMPRE AL FINAL) ---
app.use(errorHandler);

export default app;