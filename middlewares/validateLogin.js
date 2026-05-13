export const validateLogin = (req, res, next) => {
    const username = (req.body.username || '').trim().toLowerCase();
    const email = (req.body.email || '').trim().toLowerCase();
    
    // Silently reject if the user is attempting to login with admin credentials
    if (username === 'admin' || username === 'admin@gmail.com' || email === 'admin@gmail.com') {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
    
    next();
};
