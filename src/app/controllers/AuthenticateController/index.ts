import { Request, Response } from "express";
import { SignUpUseCase } from "../../useCases/signUpUseCase";
import { VerifyEmailUseCase } from "../../useCases/verifyEmailUseCase";
import { SignInUseCase } from '../../useCases/signInUseCase'

class AuthenticateController {
    async signUp(request: Request, response: Response) {
        const { email, password, name, sexo } = request.body;

        const signUpUseCase = new SignUpUseCase()

        const userCreated = await signUpUseCase.execute({
            email,
            password,
            name,
            sexo
        });
        if (!userCreated) {
            return response.status(500).json({
                error: {
                    message: "Não foi possível realizar o cadastro!"
                },
                body: null
            });
        }
        return response.status(201).json({
            error: null,
            body: {
                success: true,
                data: { message: "Cadastro realizado com sucesso!" }
            }
        });
    }
    async verifyEmail(request: Request, response: Response) {
        const email: string = request.query.email as string;
        const verifyEmail = new VerifyEmailUseCase();

        const result = await verifyEmail.execute({
            email
        });
        
        return response.status(200).json(result);

    }
    async signIn(request: Request, response: Response) {
        const { email, password } = request.body;
        const signInUseCase = new SignInUseCase();

        const result = await signInUseCase.execute({
            email,
            password
        });

        return response.status(200).json(result);
    }
}

export { AuthenticateController }