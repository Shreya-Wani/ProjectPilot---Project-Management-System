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
const getNoteById = async (req, res) => {
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

};