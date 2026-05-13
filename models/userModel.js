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
    isBlocked: {
        type: Boolean,
        default: false,
        index: true
    },
    blockedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
