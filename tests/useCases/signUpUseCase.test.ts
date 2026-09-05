import { SignUpUseCase } from '../../src/app/useCases/signUpUseCase';
import { AppError } from '../../src/utils/error';

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: jest.fn(),
        role: {
            find: jest.fn(),
        },
        ROLES: { AUTHENTICATED: 'authenticated', ADMIN: 'admin' },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hash-gerado'),
}));

import db from '../../src/database/models';

describe('SignUpUseCase', () => {
    const useCase = new SignUpUseCase();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar usuário e atribuir roles de autenticado', async () => {
        const roles = [{ _id: 'role-1' }, { _id: 'role-2' }];
        const userInstance: Record<string, any> = { roles: [] as string[], save: jest.fn() };
        (userInstance.save as jest.Mock).mockResolvedValue(userInstance);

        (db.user as unknown as jest.Mock).mockImplementation((data: any) => {
            Object.assign(userInstance, data);
            return userInstance;
        });
        (db.role.find as jest.Mock).mockResolvedValue(roles);

        const result = await useCase.execute({
            name: 'Maria',
            password: '123456',
            email: 'maria@email.com',
            sexo: 'F',
        });

        expect(result).toBe(true);
        expect(userInstance.name).toBe('Maria');
        expect(userInstance.sexo).toBe('F');
        expect(userInstance.roles).toEqual(['role-1', 'role-2']);
        expect(db.role.find).toHaveBeenCalledWith({
            name: 'authenticated',
        });
    });

    it('deve lançar AppError quando ocorre erro no save', async () => {
        const userInstance: Record<string, any> = { roles: [] as string[], save: jest.fn() };
        (userInstance.save as jest.Mock).mockRejectedValue(new Error('falha no banco'));

        (db.user as unknown as jest.Mock).mockImplementation(() => userInstance);

        let caught: unknown;
        try {
            await useCase.execute({
                name: 'Maria',
                password: '123456',
                email: 'maria@email.com',
                sexo: 'F',
            });
        } catch (error) {
            caught = error;
        }

        expect(caught).toBeInstanceOf(AppError);
    });

    it('deve lançar AppError de e-mail em uso quando ocorre erro de chave duplicada (11000)', async () => {
        const userInstance: Record<string, any> = { roles: [] as string[], save: jest.fn() };
        (userInstance.save as jest.Mock).mockRejectedValue({ code: 11000 });

        (db.user as unknown as jest.Mock).mockImplementation(() => userInstance);

        await expect(
            useCase.execute({
                name: 'Maria',
                password: '123456',
                email: 'duplicado@email.com',
                sexo: 'F',
            })
        ).rejects.toThrow('Este email já está sendo utilizado!');
    });
});