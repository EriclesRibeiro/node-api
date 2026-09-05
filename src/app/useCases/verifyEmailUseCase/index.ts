import db from "../../../database/models";

interface IVerifyRequest {
    email: string;
}

class VerifyEmailUseCase {
    async execute({ email }: IVerifyRequest) {
            const User = db.user;
            const user = await User.findOne({
                email: email
            })

            return {
                error: null,
                body: {
                    success: true,
                    data: { exists: !!user }
                }
            };
    }
}

export { VerifyEmailUseCase }