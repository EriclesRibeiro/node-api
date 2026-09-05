import { VerifyEmailUseCase } from '../../src/app/useCases/verifyEmailUseCase';

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: {
            findOne: jest.fn(),
        },
        role: {},
    },
}));

import db from '../../src/database/models';

describe('VerifyEmailUseCase', () => {
    const useCase = new VerifyEmailUseCase();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar exists true quando o usuário existe', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue({ email: 'existente@email.com' });

        const result = await useCase.execute({
            email: 'existente@email.com',
        });

        expect(result).toEqual({
            error: null,
            body: {
                success: true,
                data: { exists: true },
            },
        });
    });

    it('deve retornar exists false quando o usuário não existe', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue(null);

        const result = await useCase.execute({
            email: 'novo@email.com',
        });

        expect(result.body.data.exists).toBe(false);
    });

    it('deve consultar o banco com o email informado', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue(null);

        await useCase.execute({ email: 'qualquer@email.com' });

        expect(db.user.findOne).toHaveBeenCalledWith({ email: 'qualquer@email.com' });
    });
});
