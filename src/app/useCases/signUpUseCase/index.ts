import db from "../../../database/models";
import dateFormated from "../../../utils/dateFormated";
import { hashSync } from 'bcrypt'

interface IUserRequest {
    name: String;
    password: String;
    email: String;
    sexo: String;
}

class SignUpUseCase {
    async execute({ name, password, email, sexo }: IUserRequest) {
        //Validação dos dados da requisição
        if (!email) {
            throw new Error("É necessário informar o email!");
        }
        if (!name) {
            throw new Error("É necessário informar o nome!");
        }
        if (!password) {
            throw new Error("É necessário informar a senha!");
        }
        if (!sexo) {
            throw new Error("É necessário informar o sexo!");
        }
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
                return false
            }
            Role.find({
                name: { $in: 'authenticated' }
            }, (err: any, roles: any) => {
                if (err) {
                    return false
                }
                user.roles = roles.map((role: any) => role._id)
                user.save((err, response) => {
                    if (err) {
                        return false;
                    }
                })
            })
        })
        return true;
    }
}

export { SignUpUseCase }