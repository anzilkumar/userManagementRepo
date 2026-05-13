export const validateSignup = (req, res, next) => {
    const username = (req.body.username || '').trim().toLowerCase();
    const email = (req.body.email || '').trim().toLowerCase();
    
    if (username === 'admin') {
        return res.status(409).json({
            success: false,
            errors: { username: 'Username is not available' }
        });
    }

    if (email === 'admin@gmail.com') {
        return res.status(409).json({
            success: false,
            errors: { email: 'Email is not available' }
        });
    }
    
    next();
};
