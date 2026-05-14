import express from 'express';

import { renderLogin, loginUser, renderSignup, signupUser, renderHome, logoutUser, checkSignupAvailability } from '../controllers/userController.js';
import { requireAuth, redirectIfLoggedIn } from '../middlewares/authMiddleware.js';
import { validateSignup } from '../middlewares/validateSignup.js';
import { validateLogin } from '../middlewares/validateLogin.js';

const userRoute = express.Router();

userRoute.get('/', redirectIfLoggedIn, renderLogin);
userRoute.post('/login', validateLogin, loginUser);
userRoute.get('/signup', redirectIfLoggedIn, renderSignup);
userRoute.get('/signup/check', redirectIfLoggedIn, checkSignupAvailability);
userRoute.post('/signup', validateSignup, signupUser);
userRoute.get('/home', requireAuth, renderHome);
userRoute.get('/logout', logoutUser);

export default userRoute;
