import db from "../../../database/models";
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken';

interface IUserRequest {
    email: string;
    password: string;
}

class SignInUseCase {
    async execute({ email, password }: IUserRequest) {
        try {
            const User = db.user;

            if (!email) {
                throw new Error("É necessário informar o email!");
            }
            if (!password) {
                throw new Error("É necessário informar a senha!");
            }
            const user = await User.findOne({
                email: email
            });

            if (!user) {
                throw new Error("Email ou senha não conferem!");
            }
            const credentialPassword: string = user.password as string;
            const isValid = compareSync(password, credentialPassword);

            if (!isValid) {
                throw new Error("Senha incorreta!");
            }

            const secret: string = process.env.SECRET as string;
            const token = sign({ name: user._id }, secret, {
                expiresIn: 7200 //2h
            });

            return {
                name: user.name,
                email: user.email,
                accessToken: {
                    token: token
                }
            }

        } catch (error) {
            throw new Error("Erro ao tentar realizar o cadastro! Por favor, tente novamente mais tarde!");
        }
    }
}

export { SignInUseCase }