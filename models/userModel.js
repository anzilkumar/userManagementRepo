import mongoose from 'mongoose';

const usernameRegex = /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z0-9_.]{3,20}$/;
const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        match: usernameRegex
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
        match: emailRegex
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => passwordRegex.test(value),
            message: 'Password must contain at least 6 characters, one number, and one special character'
        }
    },
    profileImage: {
        type: String,
        default: ''
    },
    scoreHistory: [{
        score: { type: Number, required: true, min: 0 },
        completionTimeMs: { type: Number, required: true, min: 0 },
        gameType: { type: String, enum: ['crossword', 'word-search'], required: true },
        topic: {
            type: String,
            enum: ['javascript', 'nodejs', 'mongodb', 'general-tech'],
            required: true
        },
        playedAt: { type: Date, default: Date.now }
    }],
    totalPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    completedGames: {
        type: Number,
        default: 0,
        min: 0
    },
    completionTimes: [{
        durationMs: { type: Number, required: true, min: 0 },
        gameType: { type: String, enum: ['crossword', 'word-search'], required: true },
        topic: {
            type: String,
            enum: ['javascript', 'nodejs', 'mongodb', 'general-tech'],
            required: true
        },
        completedAt: { type: Date, default: Date.now }
    }],
    rankHistory: [{
        rank: { type: Number, min: 1 },
        score: { type: Number, min: 0 },
        topic: String,
        gameType: String,
        recordedAt: { type: Date, default: Date.now }
    }],
    bestScore: {
        type: Number,
        default: 0,
        min: 0
    },
    latestScore: {
        type: Number,
        default: 0,
        min: 0
    },
    averageScore: {
        type: Number,
        default: 0,
        min: 0
    },
    fastestCompletionTimeMs: {
        type: Number,
        default: null
    },
    isBlocked: {
        type: Boolean,
        default: false,
        index: true
    },
    blockedAt: {
        type: Date,
        default: null
    },
    scoreboardHidden: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

userSchema.index({ totalPoints: -1 });

export default mongoose.model('User', userSchema);
