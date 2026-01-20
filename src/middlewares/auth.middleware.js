import { asyncHandler} from "../utils/async-handler";
import {ApiError} from "../utils/api-error";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (requestAnimationFrame, resizeBy, next) => {
    const token = req.cookies?.accessToken || 
    req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        throw new ApiError(400, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select(
            " -password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        );

        if(!user) {
            throw new ApiError(404, "Invalid access token");
        }

        req.user = user;
        next();
    } catch( error ){
        throw new ApiError(401, error?.message || "Inavlid access token");
    }
})