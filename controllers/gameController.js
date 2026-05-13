import { startGameSession } from '../services/gameSessionService.js';
import { getGameTypes, getQuestionTopics, getQuestionsForSession } from '../services/questionService.js';
import { submitGameSession } from '../services/scoreService.js';

export const getQuestionMeta = (req, res) => {
    res.json({
        success: true,
        topics: getQuestionTopics(),
        gameTypes: getGameTypes()
    });
};

export const getQuestions = async (req, res) => {
    const questions = await getQuestionsForSession({
        topic: req.query.topic,
        gameType: req.query.gameType,
        limit: Number(req.query.limit) || 6
    });

    res.json({
        success: true,
        source: 'backend',
        questions: questions.map((question) => ({
            id: question._id,
            slug: question.slug,
            topic: question.topic,
            gameType: question.gameType,
            difficulty: question.difficulty,
            question: question.question,
            answer: question.answer,
            hints: question.hints,
            tags: question.tags
        }))
    });
};

export const startGame = async (req, res) => {
    const { gameType } = req.body;
    const userAccess = req.user.gameAccess || { wordSearch: true, crossword: true };
    
    if (gameType === 'word-search' && userAccess.wordSearch === false) {
         return res.status(403).json({ success: false, message: 'You do not have access to Word Search.' });
    }
    if (gameType === 'crossword' && userAccess.crossword === false) {
         return res.status(403).json({ success: false, message: 'You do not have access to Crossword.' });
    }

    const session = await startGameSession({
        userId: req.user._id,
        topic: req.body.topic,
        gameType: req.body.gameType
    });

    res.status(201).json({
        success: true,
        source: 'backend',
        session
    });
};

export const submitGame = async (req, res) => {
    const result = await submitGameSession({
        userId: req.user._id,
        sessionId: req.body.sessionId,
        answers: req.body.answers
    });

    res.json({
        success: true,
        result
    });
};

import Score from '../models/scoreModel.js';

export const getScoreboard = async (req, res) => {
    try {
        const topScores = await Score.find({ isHidden: false })
            .populate('userId', 'username profileImage isBlocked')
            .sort({ score: -1, completionTime: 1 })
            .limit(50)
            .lean();

        const validScores = topScores.filter(score => score.userId && !score.userId.isBlocked);

        validScores.forEach((score, index) => {
            score.rank = index + 1;
        });

        return res.status(200).json({ success: true, data: validScores });
    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        return res.status(500).json({ success: false, message: 'Server error fetching scoreboard' });
    }
};
