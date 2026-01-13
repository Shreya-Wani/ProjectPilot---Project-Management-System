import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localpath: String
        },
        default: {
            url: `https://placehold.co/600x400/`,
            localpath: ''
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        forgotPasswordToken: {
            type: String,
            default: null,
        },
        forgotPasswordTokenExpiry: {
            type: Date,
            default: null,
        },
        refreshToken: {
            type: String,
        },
    }
},
{ timestamps: true }
);



export const User = mongoose.model('User', userSchema);