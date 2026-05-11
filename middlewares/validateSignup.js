import { ADMIN_USERNAME, ADMIN_EMAIL } from '../config/env.js';

const validateUsername = (username = '') => {
    if (!username) return 'Please enter username';
    if (username.length < 3 || username.length > 20) return 'Username must contain 3 to 20 characters';
    if (/\s/.test(username)) return 'Spaces are not allowed in username';
    if (!/^[a-z0-9_.]+$/.test(username)) {
        return 'Use only letters (a-z), numbers (0-9), underscore (_) and dot (.)';
    }
    if (username.includes('..')) return "Do not use two dots together like '..'";
    if (username.startsWith('.')) return "Username cannot start with '.'";
    if (username.endsWith('.')) return "Username cannot end with '.'";
    return '';
};

const validateEmail = (email = '') => {
    const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

    if (!email) return 'Please enter email address';
    if (/\s/.test(email) || !emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
};

const validatePassword = (password = '', confirmPassword = '') => {
    const errors = {};

    if (!password) errors.password = 'Please enter password';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';

    if (!errors.password && password.length < 6) {
        errors.password = 'Password must contain at least 6 characters';
    }

    if (!errors.password && !/\d/.test(password)) {
        errors.password = 'Password must contain at least one number';
    }

    if (!errors.password && !/[^A-Za-z0-9]/.test(password)) {
        errors.password = 'Password must contain at least one special character';
    }

    if (!errors.confirmPassword && password && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};

const reservedCredentialResponse = (res, errorType, message) => (
    res.status(409).json({
        success: false,
        errorType,
        message,
        errors: { [errorType]: message }
    })
);

const validateSignup = (req, res, next) => {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || req.body.confirm_password || '';

    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
        return reservedCredentialResponse(res, 'username', 'Username not available');
    }

    if (email === ADMIN_EMAIL.toLowerCase()) {
        return reservedCredentialResponse(res, 'email', 'Email not available');
    }

    const errors = {};
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordErrors = validatePassword(password, confirmPassword);

    if (usernameError) errors.username = usernameError;
    if (emailError) errors.email = emailError;
    Object.assign(errors, passwordErrors);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    req.body.username = username;
    req.body.email = email;
    req.body.password = password;
    req.body.confirmPassword = confirmPassword;

    return next();
};

export default validateSignup;
