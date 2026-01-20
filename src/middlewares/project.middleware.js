import mongoose from "mongoose";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const validateProjectPermission = (roles = []) =>
    asyncHandler(async (req, res, next) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError(400, "Invalid project id");
        }

        const projectMember = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id),
        });

        if (!projectMember) {
            throw new ApiError(403, "You are not a member of this project");
        }

        const userRole = projectMember.role;

        req.user.role = userRole;

        if (roles.length && !roles.includes(userRole)) {
            throw new ApiError(403, "You do not have permission for this action");
        }

        next();
    });
