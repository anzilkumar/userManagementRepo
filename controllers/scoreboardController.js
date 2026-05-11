import { getScoreboard, getUserRank } from '../services/scoreService.js';

export const listScoreboard = async (req, res) => {
    const scoreboard = await getScoreboard({
        page: req.query.page,
        limit: req.query.limit,
        topic: req.query.topic,
        gameType: req.query.gameType
    });

    res.json({
        success: true,
        scoreboard
    });
};

export const getMyStats = async (req, res) => {
    const user = req.user;
    const currentRank = await getUserRank(user._id);

    res.json({
        success: true,
        stats: {
            totalPoints: user.totalPoints,
            completedGames: user.completedGames,
            bestScore: user.bestScore,
            latestScore: user.latestScore,
            averageScore: user.averageScore,
            fastestCompletionTimeMs: user.fastestCompletionTimeMs,
            currentRank
        }
    });
};
