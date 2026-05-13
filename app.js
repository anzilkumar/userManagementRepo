import express from 'express';
import session from 'express-session';

import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import { attachUser } from './middlewares/authMiddleware.js';
import { attachAdmin } from './middlewares/adminAuthMiddleware.js';

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/', attachUser, userRoute);
app.use('/admin', attachAdmin, adminRoute);

export default app;
