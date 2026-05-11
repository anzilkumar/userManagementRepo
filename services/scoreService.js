import GameSession from '../models/gameSessionModel.js';
import Scoreboard from '../models/scoreboardModel.js';
import User from '../models/userModel.js';

const POINTS_PER_QUESTION = 100;
const MIN_COMPLETION_TIME_MS = 2000;
const MAX_COMPLETION_TIME_MS = 60 * 60 * 1000;

const cleanAnswer = (value = '') => String(value).toUpperCase().replace(/[^A-Z0-9]/g, '');

const calculateAverage = (totalPoints, completedGames) => (
    completedGames > 0 ? Math.round(totalPoints / completedGames) : 0
);

export const recalculateRankings = async () => {
    const entries = await Scoreboard.find({ isDeleted: false })
        .sort({ score: -1, completionTimeMs: 1, createdAt: 1 })
        .populate('user', 'username profileImage isBlocked scoreboardHidden')
        .exec();

    const visibleEntries = entries.filter((entry) => entry.user && !entry.user.isBlocked && !entry.user.scoreboardHidden);

    const bulkOperations = visibleEntries.map((entry, index) => ({
        updateOne: {
            filter: { _id: entry._id },
            update: { rankingPosition: index + 1 }
        }
    }));

    if (bulkOperations.length > 0) {
        await Scoreboard.bulkWrite(bulkOperations);
    }

    return visibleEntries.length;
};

export const buildScoreboardQuery = ({ topic, gameType }) => {
    const query = { isDeleted: false };

    if (topic) query.topic = topic;
    if (gameType) query.gameType = gameType;

    return query;
};

export const getScoreboard = async ({ page = 1, limit = 20, topic, gameType } = {}) => {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
    const query = buildScoreboardQuery({ topic, gameType });
    const skip = (safePage - 1) * safeLimit;

    const entries = await Scoreboard.aggregate([
        { $match: query },
        { $sort: { score: -1, completionTimeMs: 1, createdAt: 1 } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        { $match: { 'user.isBlocked': false, 'user.scoreboardHidden': false } },
        { $skip: skip },
        { $limit: safeLimit },
        {
            $project: {
                score: 1,
                completionTimeMs: 1,
                gameType: 1,
                topic: 1,
                createdAt: 1,
                'user.username': 1,
                'user.profileImage': 1
            }
        }
    ]);

    const visibleEntries = entries
        .map((entry, index) => ({
            id: entry._id,
            rank: skip + index + 1,
            username: entry.user.username,
            profileImage: entry.user.profileImage,
            score: entry.score,
            completionTimeMs: entry.completionTimeMs,
            gameType: entry.gameType,
            topic: entry.topic,
            createdAt: entry.createdAt
        }));

    return {
        page: safePage,
        limit: safeLimit,
        entries: visibleEntries
    };
};

export const getUserRank = async (userId) => {
    const allEntries = await Scoreboard.find({ isDeleted: false })
        .sort({ score: -1, completionTimeMs: 1, createdAt: 1 })
        .populate('user', 'isBlocked scoreboardHidden')
        .lean();

    const visibleEntries = allEntries.filter((entry) => entry.user && !entry.user.isBlocked && !entry.user.scoreboardHidden);
    const index = visibleEntries.findIndex((entry) => String(entry.user._id) === String(userId));

    return index >= 0 ? index + 1 : null;
};

export const submitGameSession = async ({ userId, sessionId, answers = [] }) => {
    const session = await GameSession.findOne({ _id: sessionId, user: userId, status: 'active' }).populate('questions');

    if (!session) {
        const error = new Error('Game session is already submitted, expired, or invalid.');
        error.statusCode = 409;
        throw error;
    }

    const now = new Date();
    const durationMs = now.getTime() - session.startedAt.getTime();

    if (durationMs < MIN_COMPLETION_TIME_MS || durationMs > MAX_COMPLETION_TIME_MS) {
        session.status = 'expired';
        await session.save();

        const error = new Error('Completion time failed server validation.');
        error.statusCode = 422;
        throw error;
    }

    const answerMap = new Map(answers.map((item) => [String(item.questionId), cleanAnswer(item.answer)]));
    const submittedAnswers = [];
    let correctAnswers = 0;

    session.questions.forEach((question) => {
        const submitted = answerMap.get(String(question._id)) || '';
        const expected = cleanAnswer(question.answer);

        submittedAnswers.push({
            question: question._id,
            answer: submitted || 'BLANK'
        });

        if (submitted === expected) correctAnswers += 1;
    });

    const score = correctAnswers * POINTS_PER_QUESTION;

    session.status = 'completed';
    session.completedAt = now;
    session.durationMs = durationMs;
    session.submittedAnswers = submittedAnswers;
    session.correctAnswers = correctAnswers;
    session.score = score;
    await session.save();

    const scoreboardEntry = await Scoreboard.create({
        user: userId,
        gameSession: session._id,
        score,
        completionTimeMs: durationMs,
        gameType: session.gameType,
        topic: session.topic
    });

    const user = await User.findById(userId);
    if (user) {
        const completedGames = user.completedGames + 1;
        const totalPoints = user.totalPoints + score;
        const fastestCompletionTimeMs = user.fastestCompletionTimeMs === null
            ? durationMs
            : Math.min(user.fastestCompletionTimeMs, durationMs);

        user.scoreHistory.push({
            score,
            completionTimeMs: durationMs,
            gameType: session.gameType,
            topic: session.topic,
            playedAt: now
        });
        user.completionTimes.push({
            durationMs,
            gameType: session.gameType,
            topic: session.topic,
            completedAt: now
        });
        user.completedGames = completedGames;
        user.totalPoints = totalPoints;
        user.latestScore = score;
        user.bestScore = Math.max(user.bestScore, score);
        user.averageScore = calculateAverage(totalPoints, completedGames);
        user.fastestCompletionTimeMs = fastestCompletionTimeMs;
        await user.save();
    }

    await recalculateRankings();

    const freshEntry = await Scoreboard.findById(scoreboardEntry._id).lean();
    if (user && freshEntry?.rankingPosition) {
        user.rankHistory.push({
            rank: freshEntry.rankingPosition,
            score,
            topic: session.topic,
            gameType: session.gameType,
            recordedAt: now
        });
        await user.save();
    }

    return {
        score,
        correctAnswers,
        totalQuestions: session.questions.length,
        completionTimeMs: durationMs,
        rank: freshEntry?.rankingPosition || null
    };
};
