import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({});

export const Project = mongoose.model('Project', projectSchema);