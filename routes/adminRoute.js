import express from 'express';

import { adminLogin, logoutAdmin, renderAdminLogin } from '../controllers/adminController.js';

const adminRoute = express.Router();

adminRoute.get('/', renderAdminLogin);
adminRoute.post('/login', adminLogin); 
adminRoute.get('/logout', logoutAdmin);

export default adminRoute;
