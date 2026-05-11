import express from 'express';

import { getQuestionMeta, getQuestions, startGame, submitGame } from '../controllers/gameController.js';
import { listScoreboard, getMyStats } from '../controllers/scoreboardController.js';
import { renderLogin, loginUser, renderSignup, signupUser, renderHome, logoutUser, renderScoreboard } from '../controllers/userController.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import rateLimiter from '../middlewares/rateLimiter.js';
import validateLogin from '../middlewares/validateLogin.js';
import validateSignup from '../middlewares/validateSignup.js';

const userRoute = express.Router();

userRoute.get('/', renderLogin);
userRoute.post('/login', validateLogin, asyncHandler(loginUser));
userRoute.get('/signup', renderSignup);
userRoute.post('/signup', validateSignup, asyncHandler(signupUser));
userRoute.get('/home', asyncHandler(authMiddleware), asyncHandler(renderHome));
userRoute.get('/scoreboard', asyncHandler(authMiddleware), renderScoreboard);
userRoute.get('/logout', logoutUser);

userRoute.get('/api/questions/meta', asyncHandler(authMiddleware), getQuestionMeta);
userRoute.get('/api/questions', asyncHandler(authMiddleware), asyncHandler(getQuestions));
userRoute.post('/api/game/start', asyncHandler(authMiddleware), rateLimiter({ windowMs: 60 * 1000, max: 20 }), asyncHandler(startGame));
userRoute.post('/api/game/submit', asyncHandler(authMiddleware), rateLimiter({ windowMs: 60 * 1000, max: 12 }), asyncHandler(submitGame));
userRoute.get('/api/scoreboard', asyncHandler(authMiddleware), asyncHandler(listScoreboard));
userRoute.get('/api/me/stats', asyncHandler(authMiddleware), asyncHandler(getMyStats));

export default userRoute;
