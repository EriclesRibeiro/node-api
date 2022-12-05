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
            password: hashSync(password, 8),
            categories: [],
            created_at: currentDate,
            updated_at: currentDate,
            roles: []
        }).save((err, user) => {
            if (err) {
                throw new AppError("Ocorreu um erro ao cadastrar!", Constant.BAD_REQUEST);
            }
            Role.find({
                name: { $in: 'authenticated' }
            }, (err: any, roles: any) => {
                if (err) {
                    throw new AppError("Ocorreu um erro ao cadastrar!", Constant.BAD_REQUEST);
                }
                user.roles = roles.map((role: any) => role._id)
                user.save((err, response) => {
                    if (err) {
                        throw new AppError("Ocorreu um erro ao cadastrar!", Constant.BAD_REQUEST);
                    }
                });
            });
        });
        return true;
    }
}

export { SignUpUseCase }