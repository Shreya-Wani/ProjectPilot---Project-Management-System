import mongoose from "mongoose";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import { User } from "../models/user.model.js";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.find({ user: req.user._id})
        .populate("project");
        selectFields("project")
    
    return res.status(200).json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const projectMember = ProjectMember.findOne({
        project: projectId,
        user: req.user._id
    }).populate("project");

    if (!projectMember) {
        throw new ApiError(403, "You do not have access to this project");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            projectMember.project,
            "Project fetched successfully"
        )
    );
});

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Project name is required");
    }

    //create project
    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id
    });

    //add creater as admin of project
    await ProjectMember.create({
        project: project._id,
        user: req.user._id,
        role: UserRolesEnum.ADMIN
        })

    return res.status(200).json(
        new ApiResponse(201, project, "Project created successfully")
    )

});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId }  = req.params;
    const { name, description } = req.body;

    if(!projectId){
        throw new ApiError(400, "Project ID is required")
    }

    if(!name && !description) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const project = await Project.findByIdAndUpdate(
        projectId,
        { name, description },
        { new: true}
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "Project updated successfully"
        )
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    //delete project
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    //remove all members of this project
    await ProjectMember.deleteMany({
        project: projectId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Project deleted successfully"
        )
    );
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    if (!projectId || !userId || !role) {
        throw new ApiError(400, "Project ID, User ID and role are required");
    }

    const user = User.findById(userId);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    //Check if user is already a member
    const existingUser = await ProjectMember.findOne({
        project: projectId,
        user: userId
    });

    if(existingUser){
        throw new ApiError(409, "User is already a member of this project");
    }

    // add memeber
    const member = await ProjectMember.create({
        project: projectId,
        user: userId,
        role
    });

    return res.status(201).json(
        new ApiResponse(200, member, "member added to project successfully")
    ) 
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if(!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const members = await ProjectMember.find({
        project: projectId
    }).populate("user", "username email avatar")
      .select("user role cretedAt");

    return res.status(200).json(
        new ApiResponse(
            200, members, "Project members fetched successfully"
        )
    );
    
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});

const deleteMemberRole = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    
    //validation
});