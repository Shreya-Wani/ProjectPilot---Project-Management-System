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

//get tasks by projets
const getTaskByProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;

    if(!projectId){
        throw new ApiError(400, "Projects is required");
    }

    const tasks = await Task.find({
        project: projectId
    }).populate("assignedTo", "username email")
      .populate("assignedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200,tasks,"Tasks fetched successfully")
    );
});

//update task
const updateTask = asyncHandler(async (req,res) => {
    const { taskId } = req.params;
    const {title, description, status, assignTo } = req.body;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Task not found");
    }

    // if reassigned, ensure new user is a project member
    if(assignTo) {
        const isMember = await ProjectMember.findOne({
            project: task.project,
            user: assignTo
        });

        if(!isMember) {
            throw new ApiError(400, "Assigned user is not a member of this project")
        }

        task.assignedTo = assignTo;
    }

    if(title) task.title = title;
    if(description) task.description = description;
    if(status) task.status = status;

    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});

//delete task
const deleteTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    const task = await Task.findById(taskId);
    if(!task){
        throw new ApiError(404, "Task not found");
    }

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
});