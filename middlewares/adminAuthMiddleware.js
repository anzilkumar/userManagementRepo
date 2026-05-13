export const attachAdmin = (req, res, next) => {
    req.admin = req.session?.admin || null;
    next();
};

export const requireAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.redirect('/admin');
    }
    next();
};

export const redirectIfAdminLoggedIn = (req, res, next) => {
    if (req.admin) {
        return res.redirect('/admin/dashboard');
    }
    next();
};
