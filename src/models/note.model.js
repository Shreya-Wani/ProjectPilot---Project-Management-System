import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({});

export const Note = mongoose.model('Note', noteSchema);