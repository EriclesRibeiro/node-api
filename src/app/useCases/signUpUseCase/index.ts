import db from "../../../database/models";
import dateFormated from "../../../utils/dateFormated";
import { hashSync } from 'bcrypt'
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

        const currentDate = dateFormated(new Date());
        const User = db.user;
        const Role = db.role;

        const user = new User({
            name: name,
            sexo: sexo,
            email: email,
            password: hashSync(password, 12),
            categories: [],
            created_at: currentDate,
            updated_at: currentDate,
            roles: []
        });

        try {
            await user.save();

            const roles = await Role.find({
                name: { $in: ['authenticated'] }
            });

            user.roles = roles.map((role: any) => role._id);
            await user.save();

            return true;
        } catch (error) {
            throw new AppError("Ocorreu um erro ao cadastrar!", Constant.GENERIC_ERROR);
        }
    }
}

export { SignUpUseCase }