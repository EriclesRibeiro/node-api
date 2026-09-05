import db from "../../../database/models";
import dateFormatted from "../../../utils/dateFormatted";
import normalizeEmail from "../../../utils/normalizeEmail";
import { hash } from 'bcrypt'
import Constant from '../../../utils/constants';
import { AppError } from "../../../utils/error";

interface IUserRequest {
    name: string;
    password: string;
    email: string;
    sexo: string;
}

class SignUpUseCase {
    async execute({ name, password, email, sexo }: IUserRequest) {

        email = normalizeEmail(email);
        const currentDate = dateFormatted(new Date());
        const User = db.user;
        const Role = db.role;

        try {
            const roles = await Role.find({
                name: db.ROLES.AUTHENTICATED
            });

            const user = new User({
                name: name,
                sexo: sexo,
                email: email,
                password: await hash(password, 12),
                categories: [],
                created_at: currentDate,
                updated_at: currentDate,
                roles: roles.map((role) => role._id)
            });

            await user.save();

            return true;
        } catch (error) {
            if ((error as { code?: number }).code === 11000) {
                throw new AppError("Este email já está sendo utilizado!", Constant.CONFLICT);
            }
            throw new AppError("Ocorreu um erro ao cadastrar!", Constant.GENERIC_ERROR);
        }
    }
}

export { SignUpUseCase }