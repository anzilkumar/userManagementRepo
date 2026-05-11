import User from '../models/userModel.js';
import Scoreboard from '../models/scoreboardModel.js';
import { recalculateRankings } from '../services/scoreService.js';
import { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.js';

const INVALID_ADMIN_LOGIN_RESPONSE = {
    success: false,
    message: 'Invalid username or password'
};

export const renderAdminLogin = (req, res) => {
    res.clearCookie('adminAuth');
    res.render('admin/admin');
};

export const adminLogin = async (req, res) => {
    const username = (req.body.username || '').trim().toLowerCase();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const isAdminIdentifier = username === ADMIN_USERNAME || username === ADMIN_EMAIL || email === ADMIN_EMAIL;

    if (!isAdminIdentifier) {
        return res.status(401).json(INVALID_ADMIN_LOGIN_RESPONSE);
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json(INVALID_ADMIN_LOGIN_RESPONSE);
    }

    res.cookie('adminAuth', 'true', {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.clearCookie('userAuth');

    return res.json({ success: true, redirectUrl: '/admin/dashboard' });
};

export const renderAdminDashboard = async (req, res) => {
    const users = await User.find({}, 'username email isBlocked scoreboardHidden totalPoints completedGames createdAt')
        .sort({ username: 1 })
        .lean();
    const scores = await Scoreboard.find({ isDeleted: false })
        .sort({ score: -1, completionTimeMs: 1, createdAt: 1 })
        .limit(50)
        .populate('user', 'username profileImage isBlocked scoreboardHidden')
        .lean();

    res.render('admin/adminDashboard', { users, scores });
};

export const logoutAdmin = (req, res) => {
    res.clearCookie('adminAuth');
    res.redirect('/admin');
};

export const toggleUserBlock = async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    user.blockedAt = user.isBlocked ? new Date() : null;
    await user.save();
    await recalculateRankings();

    return res.json({
        success: true,
        isBlocked: user.isBlocked,
        message: user.isBlocked ? 'User blocked and hidden from scoreboard.' : 'User unblocked.'
    });
};

export const toggleScoreboardVisibility = async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.scoreboardHidden = !user.scoreboardHidden;
    await user.save();
    await recalculateRankings();

    return res.json({
        success: true,
        scoreboardHidden: user.scoreboardHidden,
        message: user.scoreboardHidden ? 'User scores hidden from global board.' : 'User scores restored.'
    });
};

export const deleteScore = async (req, res) => {
    const score = await Scoreboard.findById(req.params.scoreId);

    if (!score) {
        return res.status(404).json({ success: false, message: 'Score not found' });
    }

    score.isDeleted = true;
    score.deletedAt = new Date();
    score.deletedBy = 'admin';
    await score.save();
    await recalculateRankings();

    return res.json({ success: true, message: 'Score removed from scoreboard.' });
};
