import mongoose, { Schema } from 'mongoose';

const projectNoteSchema = new Schema({});

export const Note = mongoose.model('Note', projectNoteSchema);