import express from 'express';

import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoute);
app.use('/admin', adminRoute);

app.use(errorHandler);

export default app;
