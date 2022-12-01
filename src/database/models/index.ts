import mongoose from 'mongoose';
import ProjectModel from './project';
import RoleModel from './role';
import UserModel from './user';

mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    user: UserModel,
    project: ProjectModel,
    role: RoleModel,
    ROLES: ["authenticated", "admin"]
};

export default db;