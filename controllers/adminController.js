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
        return res.status(401).json({
            success: false,
            field: 'username',
            message: "Admin doesn't exist"
        });
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            field: 'password',
            message: 'Incorrect password'
        });
    }

    req.session.admin = true;

    return res.json({ success: true, redirectUrl: '/admin/dashboard' });
};



export const logoutAdmin = (req, res) => {
    delete req.session.admin;
    res.redirect('/admin');
};

export const renderAdminDashboard = async (req, res) => {
    try {
        const search = req.query.search;
        const filter = req.query.filter || 'all';
        const sort = req.query.sort || 'latest';
        
        let query = {};

        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (filter === 'active') {
            query.isBlocked = false;
        } else if (filter === 'blocked') {
            query.isBlocked = true;
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'alphabetical') {
            sortOption = { username: 1 };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find(query).sort(sortOption).skip(skip).limit(limit);
        
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({ success: true, users, totalPages, currentPage: page });
        }
        
        res.render('admin/adminDashboard', { users, search, filter, sort, totalPages, currentPage: page });
    } catch (error) {
        console.error('Error fetching admin dashboard:', error);
        res.status(500).send("Server Error");
    }
};

export const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        user.isBlocked = !user.isBlocked;
        user.blockedAt = user.isBlocked ? new Date() : null;
        await user.save();
        
        res.json({ success: true, isBlocked: user.isBlocked });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleGameAccess = async (req, res) => {
    try {
        const { game } = req.body; // 'wordSearch' or 'crossword'
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.gameAccess) {
            user.gameAccess = { wordSearch: true, crossword: true };
        }

        if (game === 'wordSearch') {
            user.gameAccess.wordSearch = !user.gameAccess.wordSearch;
        } else if (game === 'crossword') {
            user.gameAccess.crossword = !user.gameAccess.crossword;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid game specified' });
        }
        
        // Let Mongoose know gameAccess might have been updated
        user.markModified('gameAccess');
        await user.save();
        
        res.json({ success: true, gameAccess: user.gameAccess });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username }).lean();
            if (existingUsername) {
                return res.status(409).json({ success: false, errors: { username: 'Username is not available' } });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email }).lean();
            if (existingEmail) {
                return res.status(409).json({ success: false, errors: { email: 'Email is not available' } });
            }
            user.email = email;
        }

        await user.save();
        return res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error in editUser:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
