import mongoose, {Schema} from 'mongoose';

const projectMemberSchema = new Schema({});

export const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);