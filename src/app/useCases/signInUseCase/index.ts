import db from "../../../database/models";
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken';
import normalizeEmail from '../../../utils/normalizeEmail';
import Constant from '../../../utils/constants';
import { AppError } from "../../../utils/error";

interface IUserRequest {
    email: string;
    password: string;
}

class SignInUseCase {
    async execute({ email, password }: IUserRequest) {

        email = normalizeEmail(email);
        const User = db.user;

        const user = await User.findOne({
            email: email
        });

        const DUMMY_HASH = '$2b$12$wMdKDcKAk81FANw.0fFL0en04LNs0JCCIdOvLQycgrJwpwVUDgn7y';

        if (!user) {
            await compare(password, DUMMY_HASH);
            throw new AppError("Email ou senha não conferem!", Constant.UNAUTHORIZED);
        }

        const credentialPassword: string | undefined = user.password as string | undefined;

        if (!credentialPassword) {
            await compare(password, DUMMY_HASH);
            throw new AppError("Email ou senha não conferem!", Constant.UNAUTHORIZED);
        }

        const isValid = await compare(password, credentialPassword);

        if (!isValid) {
            throw new AppError("Email ou senha não conferem!", Constant.UNAUTHORIZED);
        }

        const secret: string = process.env.SECRET as string;
        const token = sign({ sub: user._id }, secret, {
            expiresIn: 7200, //2h
            algorithm: 'HS256'
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