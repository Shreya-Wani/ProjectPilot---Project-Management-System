import mongoose, {schema} from 'mongoose';

const subTaskSchema = new Schema({});

export const SubTask = mongoose.model('SubTask', subTaskSchema);