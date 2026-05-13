import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate'],
        default: 'beginner'
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    hints: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

questionSchema.index({ topic: 1, gameType: 1, isActive: 1 });

export default mongoose.model('Question', questionSchema);
