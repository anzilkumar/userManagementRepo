import User from '../models/userModel.js';
import { getCookieValue, hasCookie } from '../utils/cookies.js';

const authMiddleware = async (req, res, next) => {
    const hasUserAuth = req.session?.user || hasCookie(req, 'userAuth', 'true');
    const hasAdminAuth = req.session?.admin || hasCookie(req, 'adminAuth', 'true');

    if (hasUserAuth && hasAdminAuth) {
        res.clearCookie('userAuth');
        res.clearCookie('adminAuth');
        return res.redirect('/');
    }

    if (hasAdminAuth) {
        return res.redirect('/admin/dashboard');
    }

    if (!hasUserAuth) {
        return res.redirect('/');
    }

    const userId = req.session?.user?._id || getCookieValue(req, 'userId');

    if (!userId) {
        res.clearCookie('userAuth');
        return res.redirect('/');
    }

    const user = await User.findById(userId).select('-password');

    if (!user || user.isBlocked) {
        res.clearCookie('userAuth');
        res.clearCookie('userId');
        return res.redirect('/');
    }

    req.user = user;
    return next();
};

export default authMiddleware;
