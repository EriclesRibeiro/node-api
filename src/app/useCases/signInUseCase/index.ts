import db from "../../../database/models";
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken';
import Constant from '../../../utils/constants';
import { AppError } from "../../../utils/error";

interface IUserRequest {
    email: string;
    password: string;
}

class SignInUseCase {
    async execute({ email, password }: IUserRequest) {

        const User = db.user;

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            throw new AppError("Email ou senha não conferem!", Constant.UNAUTHORIZED);
        }

        const credentialPassword: string = user.password as string;
        const isValid = compareSync(password, credentialPassword);

        if (!isValid) {
            throw new AppError("Email ou senha não conferem!", Constant.UNAUTHORIZED);
        }

        const secret: string = process.env.SECRET as string;
        const token = sign({ name: user._id }, secret, {
            expiresIn: 7200 //2h
        });
        return {
            error: null,
            body: {
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    accessToken: token
                }
            }
        }
    }
}

export { SignInUseCase }