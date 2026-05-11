import { hasCookie } from '../utils/cookies.js';

const adminMiddleware = (req, res, next) => {
    const hasAdminAuth = req.session?.admin || hasCookie(req, 'adminAuth', 'true');
    const hasUserAuth = req.session?.user || hasCookie(req, 'userAuth', 'true');

    if (hasAdminAuth && hasUserAuth) {
        res.clearCookie('adminAuth');
        res.clearCookie('userAuth');
        return res.redirect('/admin');
    }

    if (hasUserAuth) {
        return res.redirect('/home');
    }

    if (hasAdminAuth) {
        return next();
    }

    return res.redirect('/admin');
};

export default adminMiddleware;
