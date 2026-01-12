import mongoose, { schema } from 'mongoose';

const taskSchema = new Schema({});

export const Task = mongoose.model('Task', taskSchema);