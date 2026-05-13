import GameSession from '../models/gameSessionModel.js';
import { getQuestionsForSession, normalizeQuestionOptions } from './questionService.js';

export const startGameSession = async ({ userId, topic, gameType }) => {
    const options = normalizeQuestionOptions({ topic, gameType });
    const questions = await getQuestionsForSession({ ...options, limit: 6 });

    if (questions.length < 6) {
        const error = new Error('Not enough questions available for this game mode.');
        error.statusCode = 503;
        throw error;
    }

    const session = await GameSession.create({
        user: userId,
        topic: options.topic,
        gameType: options.gameType,
        questions: questions.map((question) => question._id)
    });

    return {
        sessionId: session._id,
        topic: options.topic,
        gameType: options.gameType,
        startedAt: session.startedAt,
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
    };
};
