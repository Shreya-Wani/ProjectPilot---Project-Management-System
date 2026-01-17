import crypto from "crypto";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import User from "../models/user.model.js";
import {
  sendMail,
  emailVerificationMailContent,
  forgotPasswordMailContent
} from "../utils/mail.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
        //1. check if user already exists
        const existingUser = await username.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            throw new ApiError(409, 'User already exists');
        }});

        //2. create new user
        const newUser = await User.create({
            email,
            username,
            password,
            role
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });

        //3. generate verification email token
        const { 
            unHashedToken,
            hashedToken,
            tokenExpiry 
        } = newUser.generateTemporaryToken();

        //4. save hashed token & expiry in database
        newUser.emailVerificationToken = hashedToken;
        newUser.emailVerificationTokenExpiry = tokenExpiry;

        await newUser.save({ validateBeforeSave: false });

        //5. create email verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${unHashedToken}`;

        //6. send verification email
        await sendMail({
            email: newUser.email,
            subject: 'Verify your email address',
            mailGenContent: emailVerificationMailContent(
                newUser.username,
                verificationUrl
            )
        })

        //7.send success response
        res.status(201).json(
            new ApiResponse(
                201,
                "User registered successfully. Please verify your email to activate your account."
            )
        )

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const logoutUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

export { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, refreshAccessToken, forgotPasswordRequest, changeCurrentPassword, getCurrentUser };