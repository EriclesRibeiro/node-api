import ProjectModel from './project';
import RoleModel from './role';
import UserModel from './user';

const ROLES = {
    AUTHENTICATED: 'authenticated',
    ADMIN: 'admin'
};

const db = {
    user: UserModel,
    project: ProjectModel,
    role: RoleModel,
    ROLES
};

export default db;