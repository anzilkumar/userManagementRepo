import User from '../models/userModel.js';

export const attachUser = async (req, res, next) => {
    if (req.session?.user?._id) {
        try {
            const user = await User.findById(req.session.user._id);
            if (user && !user.isBlocked) {
                req.user = user;
            } else {
                req.session.destroy();
                req.user = null;
            }
        } catch (error) {
            console.error('Error fetching user in authMiddleware:', error);
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/');
    }
    next();
};

export const redirectIfLoggedIn = (req, res, next) => {
    if (req.user) {
        return res.redirect('/home');
    }
    next();
};
