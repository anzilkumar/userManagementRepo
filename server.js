import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.js';
import { PORT } from './config/env.js';
import { seedQuestions } from './services/questionService.js';

connectDatabase()
    .then(() => {
        console.log('Connected to MongoDB');
        return seedQuestions();
    })
    .then((seededCount) => {
        console.log(`Question bank ready (${seededCount} questions checked)`);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });
