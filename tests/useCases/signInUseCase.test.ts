import { SignInUseCase } from '../../src/app/useCases/signInUseCase';

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: {
            findOne: jest.fn(),
        },
        role: {},
    },
}));

jest.mock('bcrypt', () => ({
    compareSync: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

import db from '../../src/database/models';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

describe('SignInUseCase', () => {
    const useCase = new SignInUseCase();
    const userMock = {
        _id: 'user-123',
        name: 'João',
        email: 'joao@email.com',
        password: 'hash-banco',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SECRET = 'segredo-secreto';
    });

    it('deve lançar AppError quando o usuário não existe', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue(null);

        await expect(
            useCase.execute({ email: 'nao.existe@email.com', password: '123456' })
        ).rejects.toThrow('Email ou senha não conferem!');

        expect(compareSync).not.toHaveBeenCalled();
        expect(sign).not.toHaveBeenCalled();
    });

    it('deve lançar AppError quando a senha não confere', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue(userMock);
        (compareSync as jest.Mock).mockReturnValue(false);

        await expect(
            useCase.execute({ email: 'joao@email.com', password: 'senha-errada' })
        ).rejects.toThrow('Email ou senha não conferem!');

        expect(compareSync).toHaveBeenCalledWith('senha-errada', 'hash-banco');
        expect(sign).not.toHaveBeenCalled();
    });

    it('deve retornar token quando as credenciais são válidas', async () => {
        (db.user.findOne as jest.Mock).mockResolvedValue(userMock);
        (compareSync as jest.Mock).mockReturnValue(true);
        (sign as jest.Mock).mockReturnValue('token-gerado');

        const result = await useCase.execute({
            email: 'joao@email.com',
            password: 'senha-certa',
        });

        expect(result.body.success).toBe(true);
        expect(result.body.data).toMatchObject({
            name: 'João',
            email: 'joao@email.com',
            accessToken: 'token-gerado',
        });
        expect(sign).toHaveBeenCalledWith({ name: 'user-123' }, 'segredo-secreto', {
            expiresIn: 7200,
        });
    });
});