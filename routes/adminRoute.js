import express from 'express';

import { adminLogin, logoutAdmin, renderAdminLogin, renderAdminDashboard } from '../controllers/adminController.js';
import { requireAdmin, redirectIfAdminLoggedIn } from '../middlewares/adminAuthMiddleware.js';

const adminRoute = express.Router();

adminRoute.get('/', redirectIfAdminLoggedIn, renderAdminLogin);
adminRoute.post('/login', adminLogin); 
adminRoute.get('/logout', logoutAdmin);
adminRoute.get('/dashboard', requireAdmin, renderAdminDashboard);

export default adminRoute;
