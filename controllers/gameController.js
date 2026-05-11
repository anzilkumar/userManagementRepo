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
