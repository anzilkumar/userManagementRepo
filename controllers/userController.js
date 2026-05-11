import User from '../models/userModel.js';
import Scoreboard from '../models/scoreboardModel.js';

const invalidLoginResponse = () => ({
    success: false,
    message: 'Invalid username or password'
});

export const renderLogin = (req, res) => {
    res.clearCookie('userAuth');
    res.clearCookie('userId');
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
        totalPoints: req.user.totalPoints,
        completedGames: req.user.completedGames,
        bestScore: req.user.bestScore,
        latestScore: req.user.latestScore,
        averageScore: req.user.averageScore,
        fastestCompletionTimeMs: req.user.fastestCompletionTimeMs
    };

    const recentScores = await Scoreboard.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('user', 'username profileImage')
        .lean();

    res.render('user/home', {
        user: viewUser,
        userJson: JSON.stringify(viewUser).replace(/</g, '\\u003c'),
        recentScores
    });
};

export const renderScoreboard = (req, res) => {
    res.render('user/scoreboard', {
        user: req.user
    });
};

export const logoutUser = (req, res) => {
    res.clearCookie('userAuth');
    res.clearCookie('userId');
    res.redirect('/');
};

export const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username }).lean();
    if (existingUsername) {
        return res.status(409).json({
            success: false,
            errors: { username: 'Username not available' }
        });
    }

    const existingEmail = await User.findOne({ email }).lean();
    if (existingEmail) {
        return res.status(409).json({
            success: false,
            errors: { email: 'Email not available' }
        });
    }

    await User.create({ username, email, password });

    return res.status(201).json({ success: true, redirectUrl: '/' });
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json(invalidLoginResponse());
    }

    if (user.isBlocked) {
        return res.status(403).json({
            success: false,
            message: 'Your account has been disabled. Please contact the administrator.'
        });
    }

    if (user.password !== password) {
        return res.status(401).json(invalidLoginResponse());
    }

    res.cookie('userAuth', 'true', {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.cookie('userId', String(user._id), {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.clearCookie('adminAuth');

    return res.json({ success: true, redirectUrl: '/home' });
};
