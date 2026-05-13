export const attachUser = (req, res, next) => {
    req.user = req.session?.user || null;
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
