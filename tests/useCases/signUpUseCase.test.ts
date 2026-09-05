import { SignUpUseCase } from '../../src/app/useCases/signUpUseCase';
import { AppError } from '../../src/utils/error';

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: jest.fn(),
        role: {
            find: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    hashSync: jest.fn().mockReturnValue('hash-gerado'),
}));

import db from '../../src/database/models';

describe('SignUpUseCase', () => {
    const useCase = new SignUpUseCase();

    const buildUserInstance = (saveImpl: (err: Error | null, user?: any) => void) => {
        const instance = {
            name: '',
            sexo: '',
            email: '',
            password: '',
            roles: [] as string[],
            save: jest.fn(),
        };
        (instance.save as jest.Mock).mockImplementation(saveImpl);
        return instance;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar usuário e atribuir roles de autenticado', async () => {
        const roles = [{ _id: 'role-1' }, { _id: 'role-2' }];

        const userInstance = buildUserInstance((err, user) => {
            if (err) return;
            user.roles = roles.map((role) => role._id);
            user.save((err2: Error | null) => {
                expect(err2).toBeNull();
            });
        });

        (db.user as unknown as jest.Mock).mockImplementation((data: any) => {
            Object.assign(userInstance, data);
            return userInstance;
        });
        (db.role.find as jest.Mock).mockImplementation((_query, cb) => {
            cb(null, roles);
        });

        userInstance.save.mockImplementation((cb: any) => {
            cb(null, userInstance);
        });

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
    });

    it('deve lançar AppError quando ocorre erro no save inicial', async () => {
        const userInstance = buildUserInstance(() => {});

        (db.user as unknown as jest.Mock).mockReturnValue(userInstance);
        userInstance.save.mockImplementation((cb: any) => {
            cb(new Error('falha no banco'));
        });

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
});
