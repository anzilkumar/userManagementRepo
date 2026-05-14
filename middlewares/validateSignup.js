import { validateEmail } from '../utils/emailValidator.js';

export const validateSignup = async (req, res, next) => {
    const username = (req.body.username || '').trim().toLowerCase();
    const emailValidation = await validateEmail(req.body.email || '');

    req.body.username = username;
    req.body.email = emailValidation.email;

    if (!emailValidation.isValid) {
        return res.status(400).json({
            success: false,
            errors: { email: emailValidation.message }
        });
    }
    
    if (username === 'admin') {
        return res.status(409).json({
            success: false,
            errors: { username: 'Username is not available' }
        });
    }

    if (emailValidation.email === 'admin@gmail.com') {
        return res.status(409).json({
            success: false,
            errors: { email: 'Email is not available' }
        });
    }
    
    next();
};
