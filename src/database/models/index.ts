import ProjectModel from './project';
import RoleModel from './role';
import UserModel from './user';

const db = {
    user: UserModel,
    project: ProjectModel,
    role: RoleModel,
    ROLES: ["authenticated", "admin"]
};

export default db;