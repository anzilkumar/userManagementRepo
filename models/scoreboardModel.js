import mongoose from 'mongoose';

const scoreboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    gameSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameSession',
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    completionTimeMs: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    gameType: {
        type: String,
        enum: ['crossword', 'word-search'],
        required: true,
        index: true
    },
    topic: {
        type: String,
        enum: ['javascript', 'nodejs', 'mongodb', 'general-tech'],
        required: true,
        index: true
    },
    rankingPosition: {
        type: Number,
        default: null,
        index: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: String,
        default: ''
    }
}, { timestamps: true });

scoreboardSchema.index({ isDeleted: 1, score: -1, completionTimeMs: 1, createdAt: 1 });
scoreboardSchema.index({ topic: 1, gameType: 1, isDeleted: 1, score: -1, completionTimeMs: 1 });

export default mongoose.model('Scoreboard', scoreboardSchema);
