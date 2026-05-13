import User from '../models/userModel.js';

const invalidLoginResponse = () => ({
    success: false,
    message: 'Invalid username or password'
});

export const renderLogin = (req, res) => {
    res.render('user/user');
};

export const renderSignup = (req, res) => {
    res.render('user/signup');
};

export const renderHome = async (req, res) => {
    const viewUser = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profileImage: req.user.profileImage,
        gameAccess: req.user.gameAccess || { wordSearch: true, crossword: true }
    };

    res.render('user/home', {
        user: viewUser,
        userJson: JSON.stringify(viewUser).replace(/</g, '\\u003c')
    });
};

export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!password || password.length < 8 || /\s/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) {
        return res.status(400).json({
            success: false,
            errors: { password: 'Password does not meet the requirements' }
        });
    }

    const existingUsername = await User.findOne({ username }).lean();
    if (existingUsername) {
        return res.status(409).json({
            success: false,
            errors: { username: 'Username is not available' }
        });
    }

    const existingEmail = await User.findOne({ email }).lean();
    if (existingEmail) {
        return res.status(409).json({
            success: false,
            errors: { email: 'Email is not available' }
        });
    }

    await User.create({ username, email, password });

    return res.status(201).json({ success: true, redirectUrl: '/' });
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json({ success: false, field: 'username', message: 'Invalid username' });
    }

    if (user.isBlocked) {
        return res.status(403).json({ success: false, field: 'username', message: 'Your account has been blocked' });
    }

    if (user.password !== password) {
        return res.status(401).json({ success: false, field: 'password', message: 'Incorrect password' });
    }

    req.session.user = user;

    return res.json({ success: true, redirectUrl: '/home' });
};
