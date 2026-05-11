import { ADMIN_USERNAME, ADMIN_EMAIL } from '../config/env.js';


const INVALID_LOGIN_RESPONSE = {
    success: false,
    message: 'Invalid username or password'
};

const validateLogin = (req, res, next) => {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const normalizedUsername = username.toLowerCase();

    if (normalizedUsername === ADMIN_USERNAME || normalizedUsername === ADMIN_EMAIL || email === ADMIN_EMAIL) {
        return res.status(401).json(INVALID_LOGIN_RESPONSE);
    }

    req.body.username = username;
    req.body.email = email;

    return next();
};

export default validateLogin;
