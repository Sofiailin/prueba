import app from './app'; // Importamos la aplicación configurada desde app.ts
import { connectDB } from './config/database';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

// 1. Conectar a la Base de Datos
connectDB();

// 2. Encender el servidor
app.listen(PORT, () => {
    console.log(`🚀 Veterinaria corriendo en http://localhost:${PORT}`);
});