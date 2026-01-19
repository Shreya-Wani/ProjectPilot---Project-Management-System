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
        const user = await User.create({
            email,
            username,
            password,
            role
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: user
            }
        });

        //3. generate verification email token
        const { 
            unHashedToken,
            hashedToken,
            tokenExpiry 
        } = user.generateTemporaryToken();

        //4. save hashed token & expiry in database
        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpiry = tokenExpiry;

        await user.save({ validateBeforeSave: false });

        //5. create email verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${unHashedToken}`;

        //6. send verification email
        await sendMail({
            email: user.email,
            subject: 'Verify your email address',
            mailGenContent: emailVerificationMailContent(
                user.username,
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
    const { email, password } = req.body
    
     //1. find user by email
    const user = await User.findOne({
        email
    });

    if(!user){
        throw new ApiError(400, 'User not found');
    }

    //2. check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400, 'Invalid password');
    }

    //3. check if email is verified
    if(!user.isEmailverified){
        throw new ApiError(400, 'Email is not verified');
    }

    //4. generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //5. save refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    //6. send response
    res.status(200).json(
        new ApiResponse(200, "Login successful", {
            accessToken,
            refreshToken
        })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    //remove refresh token from database
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: { refreshToken: 1 }
        }
    );

    res.status(200).json(
        new ApiResponse(200, "Logout successful")
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if(!token) {
        throw new ApiError(400, "Verification token is missing");
    }

    //hash the token received from user
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    //find user with this token and check expiry
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    if(!user){
        throw new ApiError(400, "Invalid or expired verification token");
    }

    user.isEmailverified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    await user.save();

    res.status(200).json(
        new ApiResponse(200, "Email verifies successfully")
    );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    //find user by email
    const user = await user.findOne({
        email
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }
    
    //if already verified, no need to resend
    if(user.isEmailverified){
        throw new ApiError(400, "Email is already verified");
    }

    //Generate new verification url
    const {
        unHashedToken,
        hashedToken,
        tokenExpiry
    } = user.generateTemporaryToken();

    //save new token & expiry in DB
    user.emailVerificationToken = hashedToken;
    user.emailVerificationToken = tokenExpiry;

    await user.save({
        validateBeforeSave: false
    });

    //create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${unHashedToken}`;

    //send verification email again
    await sendMail({
        email: user.email,
        subject: "verify your email address",
        mailGenContent: emailVerificationMailContent(
            user.username,
            verificationUrl
        )
    })

    res.status(200).json(
        new ApiResponse(200, "verification email resent successfully")
    );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if(!refreshAccessToken){
        throw new ApiError(401, "Refresh token is expired")
    }

    //verify refresh token signature
    const decode = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    //Find user from decode token
    const user = await User.findById(decode._id);

    if(!user){
        throw new ApiError(401, "Invalid refresh token");
    }

    //match refreshtoken with db
    if(user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token expired or reused");
    }

    //generate new access token
    const newAccessToken = user.generateAccessToken();

    res.send(200).json(
        new ApiResponse(200, "Access token refreshed successfully", {
            accessToken: newAccessToken
        })
    );
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body
    
    //find user by email
    const user = await user.findOne(
        {
            email
        }
    );

    if(!user){
        throw new ApiError(404, "User Not Found");
    }

    //generate password reset token
    const {
        unHashedToken,
        hashedToken,
        tokenExpiry
    } = user.generateTemporaryToken();

    //Save hashed token & expiry in db
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiry = tokenExpiry;

    await user.save({
        validateBeforeSave: false
    })

    //create reset password url 
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${unHashedToken}`;

    //send reset password email
    await sendMail({
        email: sendMail({
        subject: "Reset your Password",
        mailGenContent: forgotPasswordMailContent(
            user.username,
            resetUrl
        )
        })
    });

    res.status(200).json(
        new ApiResponse(200, "Password mail sent successfully")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    //find user from database
    const user = await user.findById(userId);
    
    if(!user){
        throw new ApiError(404, "User not found");
    }

    //check if old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) {
        throw new ApiError(401, "old password is correct");
    }

    //prevent same password reuse
    const isSamePassword = await user.isPasswordCorrect(newPassword);

    if(isSamePassword) {
        throw new ApiError(
            400,
            "New p assword must be different from currwnt password"
        )
    }

    //set new password
    user.password = newPassword;

    //save user
    await user.save();

    res.status(200).json(
        new ApiResponse(200, "password changed successfully")
    )
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

export { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, refreshAccessToken, forgotPasswordRequest, changeCurrentPassword, getCurrentUser };