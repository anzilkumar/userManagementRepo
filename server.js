import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.js';
import { PORT } from './config/env.js';

connectDatabase()
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });
  