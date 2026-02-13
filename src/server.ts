import app from './app';
import { connectDB } from './config/database';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});