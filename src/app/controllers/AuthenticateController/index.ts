import { Request, Response } from "express";
import { SignUpUseCase } from "../../useCases/signUpUseCase";
import { SignInUseCase } from '../../useCases/signInUseCase';
import Constant from '../../../utils/constants';
import { AppError } from "../../../utils/error";

class AuthenticateController {
    async signUp(request: Request, response: Response) {

        const { email, password, name, sexo } = request.body;

        //Validar required
        if (typeof email !== 'string' || !email) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
        if (typeof password !== 'string' || !password) throw new AppError("É necessário informar a senha!", Constant.BAD_REQUEST);
        if (typeof password !== 'string' || password.length < 6) throw new AppError("A senha deve ter no mínimo 6 caracteres!", Constant.BAD_REQUEST);
        if (typeof password !== 'string' || password.length > 72) throw new AppError("A senha deve ter no máximo 72 caracteres!", Constant.BAD_REQUEST);
        if (typeof name !== 'string' || !name) throw new AppError("É necessário informar o nome!", Constant.BAD_REQUEST);
        if (typeof sexo !== 'string' || !sexo) throw new AppError("É necessário informar o sexo!", Constant.BAD_REQUEST);

        const signUpUseCase = new SignUpUseCase()
        await signUpUseCase.execute({
            email,
            password,
            name,
            sexo
        });

        return response.status(201).json({
            error: null,
            body: {
                success: true,
                data: { 
                    message: "Cadastro realizado com sucesso!" 
                }
            }
        });
    }
    async signIn(request: Request, response: Response) {
        const { email, password } = request.body;

        if (typeof email !== 'string' || !email) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
        if (typeof password !== 'string' || !password) throw new AppError("É necessário informar a senha!", Constant.BAD_REQUEST);

        const signInUseCase = new SignInUseCase();

        const result = await signInUseCase.execute({
            email,
            password
        });

        return response.status(200).json(result);
    }
    async me(request: Request, response: Response) {
        return response.status(200).json({
            error: null,
            body: {
                success: true,
                data: {
                    user: request.user
                }
            }
        });
    }
}

export { AuthenticateController }