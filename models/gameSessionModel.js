import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    topic: {
        type: String,
        enum: ['javascript', 'nodejs', 'mongodb', 'general-tech'],
        required: true,
        index: true
    },
    gameType: {
        type: String,
        enum: ['crossword', 'word-search'],
        required: true,
        index: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    startedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    durationMs: {
        type: Number,
        default: null
    },
    submittedAnswers: [answerSchema],
    correctAnswers: {
        type: Number,
        default: 0,
        min: 0
    },
    score: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active',
        index: true
    },
    clientStartedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

gameSessionSchema.index({ user: 1, status: 1, createdAt: -1 });

export default mongoose.model('GameSession', gameSessionSchema);
