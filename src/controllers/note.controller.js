import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";

//get all notes
const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project id");
    }

    const project = await project.findById(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const notes = await Note.find({
        project: projectId
    }).populate("createdBy", "username fullname avatar")
      .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched successfully"))
});

//get note by id
const getNoteById = asyncHandler(async (req, res) => {
    const {projectId, noteId} = req.params;

    const note = await Note.findOne({
        _id: noteId,
        project: projectId
    }).populate("createdBy", "username fullname avatar");

    if(!note){
        throw new ApiError(404, "Note not found in this project");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Notes fetched successfully"))    

});

//create note
const createNote =asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const {title, content} = req.body;
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const note = await Note.create({
        title,
        content,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    const populatedNote = await Note.findById(note._id).populate(
        "createdBy",
        "username fullname avatar"
    )

    return res.status(201).json(
        new ApiResponse(201, populatedNote, "Note created successfully")
    );
});