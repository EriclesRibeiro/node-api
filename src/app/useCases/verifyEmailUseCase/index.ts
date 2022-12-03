import db from "../../../database/models";

interface IVerifyRequest {
    email: String;
}

class VerifyEmailUseCase {
    async execute({ email }: IVerifyRequest) {
        try {
            const User = db.user;
            
            if (!email) {
                throw new Error("É necessário informar o email para verificação!");
            }
            const user = await User.findOne({
                email: email
            })
            if (user) {
                return {
                    error: null,
                    body: {
                        success: true,
                        data: { exists: true }
                    }
                };
            } else {
                return {
                    error: null,
                    body: {
                        succcess: true,
                        data: { exists: false }
                    }
                };
            }
            
        } catch (error) {
            throw new Error("Erro ao tentar realizar o cadastro! Por favor, tente novamente mais tarde!");
        }
    }
}

export { VerifyEmailUseCase }