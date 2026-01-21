import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";

//createTask
const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, assignedTo } = req.body;

    if(!title || !assignedTo) {
        throw new ApiError(400, "Title and assigned user are required");
    }

    const project = await Project.findById(projectId);
    if(!project) {
        throw new ApiError(404, "Project not found");
    }

    const isMember = await ProjectMember.findOne({
        project: projectId,
        user: assignedTo
    });

    if(!isMember){
        throw new ApiError(400, "Assigned user is not a project member");
    }

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo,
        assignedBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});

