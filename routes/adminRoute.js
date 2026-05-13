import express from 'express';

import { adminLogin, logoutAdmin, renderAdminLogin, renderAdminDashboard, toggleBlockUser, toggleGameAccess, deleteUser, editUser } from '../controllers/adminController.js';
import { requireAdmin, redirectIfAdminLoggedIn } from '../middlewares/adminAuthMiddleware.js';

const adminRoute = express.Router();

adminRoute.get('/', redirectIfAdminLoggedIn, renderAdminLogin);
adminRoute.post('/login', adminLogin); 
adminRoute.get('/logout', logoutAdmin);
adminRoute.get('/dashboard', requireAdmin, renderAdminDashboard);
adminRoute.post('/users/:id/block', requireAdmin, toggleBlockUser);
adminRoute.post('/users/:id/game-access', requireAdmin, toggleGameAccess);
adminRoute.put('/users/:id', requireAdmin, editUser);
adminRoute.delete('/users/:id', requireAdmin, deleteUser);

export default adminRoute;
