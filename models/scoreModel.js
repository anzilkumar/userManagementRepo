import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    score: {
        type: Number,
        required: true,
        index: true
    },
    completionTime: {
        type: Number, // In seconds
        required: true
    },
    gameType: {
        type: String,
        enum: ['crossword', 'word-search'],
        required: true
    },
    topic: {
        type: String,
        enum: ['javascript', 'nodejs', 'mongodb', 'general-tech'],
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound index for global ranking: highest score first, then lowest time
scoreSchema.index({ score: -1, completionTime: 1 });
scoreSchema.index({ userId: 1, gameType: 1 });

export default mongoose.model('Score', scoreSchema);
