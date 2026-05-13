import express from 'express';

import { renderLogin, loginUser, renderSignup, signupUser, renderHome, logoutUser } from '../controllers/userController.js';
import { requireAuth, redirectIfLoggedIn } from '../middlewares/authMiddleware.js';

const userRoute = express.Router();

userRoute.get('/', redirectIfLoggedIn, renderLogin);
userRoute.post('/login', loginUser);
userRoute.get('/signup', redirectIfLoggedIn, renderSignup);
userRoute.post('/signup', signupUser);
userRoute.get('/home', requireAuth, renderHome);
userRoute.get('/logout', logoutUser);

export default userRoute;
