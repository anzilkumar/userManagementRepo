import User from '../models/userModel.js';
import { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.js';

const INVALID_ADMIN_LOGIN_RESPONSE = {
    success: false,
    message: 'Invalid username or password'
};

export const renderAdminLogin = (req, res) => {
    res.render('admin/admin');
};

export const adminLogin = async (req, res) => {
    const username = (req.body.username || '').trim().toLowerCase();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const isAdminIdentifier = username === ADMIN_USERNAME || username === ADMIN_EMAIL || email === ADMIN_EMAIL;

    if (!isAdminIdentifier) {
        return res.status(401).json(INVALID_ADMIN_LOGIN_RESPONSE);
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json(INVALID_ADMIN_LOGIN_RESPONSE);
    }

    return res.json({ success: true, redirectUrl: '/admin/dashboard' });
};



export const logoutAdmin = (req, res) => {
    res.redirect('/admin');
};
