import db from "../../../database/models";
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken';

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
            return {
                error: null,
                body: {
                    success: false,
                    message: "Email ou senha não conferem!"
                }
            }
        }
        const credentialPassword: string = user.password as string;
        const isValid = compareSync(password, credentialPassword);

        if (!isValid) {
            return {
                error: null,
                body: {
                    success: false,
                    message: "Email ou senha não conferem!"
                }
            }
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