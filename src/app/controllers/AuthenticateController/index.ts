import { Request, Response } from "express";
import { SignUpUseCase } from "../../useCases/signUpUseCase";
import { VerifyEmailUseCase } from "../../useCases/verifyEmailUseCase";
import { SignInUseCase } from '../../useCases/signInUseCase';
import Constant from '../../../utils/constants';
import { AppError } from "../../../utils/error";

class AuthenticateController {
    async signUp(request: Request, response: Response) {

        const { email, password, name, sexo } = request.body;

        //Validar required
        if (!email) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
        if (!password) throw new AppError("É necessário informar a senha!", Constant.BAD_REQUEST);
        if (!name) throw new AppError("É necessário informar o nome!", Constant.BAD_REQUEST);
        if (!sexo) throw new AppError("É necessário informar o sexo!", Constant.BAD_REQUEST);

        const signUpUseCase = new SignUpUseCase()
        const userCreated = await signUpUseCase.execute({
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
    async verifyEmail(request: Request, response: Response) {
            const email: string = request.query.email as string;

            //Validar email required
            if (!email || email === undefined) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);

            const verifyEmail = new VerifyEmailUseCase();
            const result = await verifyEmail.execute({
                email
            });

            return response.status(200).json(result);
    }
    async signIn(request: Request, response: Response) {
        const { email, password } = request.body;

        if (!email || email === undefined) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
        if (!password || password === undefined) throw new AppError("É necessário informar a senha!", Constant.BAD_REQUEST);

        const signInUseCase = new SignInUseCase();

        const result = await signInUseCase.execute({
            email,
            password
        });

        return response.status(200).json(result);
    }
}

export { AuthenticateController }