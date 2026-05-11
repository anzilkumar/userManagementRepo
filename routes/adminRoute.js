import express from 'express';

import { adminLogin, deleteScore, logoutAdmin, renderAdminDashboard, renderAdminLogin, toggleScoreboardVisibility, toggleUserBlock } from '../controllers/adminController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import rateLimiter from '../middlewares/rateLimiter.js';

const adminRoute = express.Router();

adminRoute.get('/', renderAdminLogin);
adminRoute.post('/login', asyncHandler(adminLogin));
adminRoute.get('/logout', logoutAdmin);
adminRoute.get('/dashboard', adminMiddleware, asyncHandler(renderAdminDashboard));
adminRoute.post('/users/:userId/block', adminMiddleware, rateLimiter({ windowMs: 60 * 1000, max: 30 }), asyncHandler(toggleUserBlock));
adminRoute.post('/users/:userId/scoreboard-visibility', adminMiddleware, rateLimiter({ windowMs: 60 * 1000, max: 30 }), asyncHandler(toggleScoreboardVisibility));
adminRoute.delete('/scores/:scoreId', adminMiddleware, rateLimiter({ windowMs: 60 * 1000, max: 30 }), asyncHandler(deleteScore));

export default adminRoute;
