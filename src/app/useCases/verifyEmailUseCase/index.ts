import db from "../../../database/models";

interface IVerifyRequest {
    email: String;
}

class VerifyEmailUseCase {
    async execute({ email }: IVerifyRequest) {
            const User = db.user;
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
                        success: true,
                        data: { exists: false }
                    }
                };
            }
    }
}

export { VerifyEmailUseCase }