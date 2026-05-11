import Question from '../models/questionModel.js';
import buildQuestionBank, { GAME_TYPES, QUESTION_TOPICS } from '../data/questionBank.js';

const normalizeTopic = (topic) => QUESTION_TOPICS.some((item) => item.value === topic) ? topic : 'javascript';
const normalizeGameType = (gameType) => GAME_TYPES.some((item) => item.value === gameType) ? gameType : 'crossword';

export const seedQuestions = async () => {
    const questionBank = buildQuestionBank();
    const operations = questionBank.map((question) => ({
        updateOne: {
            filter: { slug: question.slug },
            update: { $setOnInsert: question },
            upsert: true
        }
    }));

    if (operations.length > 0) {
        await Question.bulkWrite(operations, { ordered: false });
    }

    return questionBank.length;
};

export const getQuestionTopics = () => QUESTION_TOPICS;
export const getGameTypes = () => GAME_TYPES;

export const getQuestionsForSession = async ({ topic, gameType, limit = 6 }) => {
    const safeTopic = normalizeTopic(topic);
    const safeGameType = normalizeGameType(gameType);

    let questions = await Question.aggregate([
        { $match: { topic: safeTopic, gameType: safeGameType, isActive: true } },
        { $sample: { size: limit } },
        {
            $project: {
                slug: 1,
                topic: 1,
                gameType: 1,
                difficulty: 1,
                question: 1,
                answer: 1,
                hints: 1,
                tags: 1
            }
        }
    ]);

    if (questions.length < limit) {
        await seedQuestions();
        questions = await Question.aggregate([
            { $match: { topic: safeTopic, gameType: safeGameType, isActive: true } },
            { $sample: { size: limit } },
            {
                $project: {
                    slug: 1,
                    topic: 1,
                    gameType: 1,
                    difficulty: 1,
                    question: 1,
                    answer: 1,
                    hints: 1,
                    tags: 1
                }
            }
        ]);
    }

    return questions;
};

export const normalizeQuestionOptions = ({ topic, gameType }) => ({
    topic: normalizeTopic(topic),
    gameType: normalizeGameType(gameType)
});
