import request from 'supertest';

const execMock: jest.Mock = jest.fn();
const userSaveMock: jest.Mock = jest.fn();
const roleFindMock: jest.Mock = jest.fn();

let findOneAwaitedValue: unknown = null;

const findOneMock: jest.Mock = jest.fn(() => ({
    exec: execMock,
    then(onFulfilled: (value: unknown) => void) {
        onFulfilled(findOneAwaitedValue);
    },
}));

const userModelMock: jest.Mock = jest.fn();

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: Object.assign(userModelMock, { findOne: findOneMock }),
        role: {
            find: roleFindMock,
        },
        ROLES: { AUTHENTICATED: 'authenticated', ADMIN: 'admin' },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hash-gerado'),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('token-teste'),
}));

import app from '../../src/app';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

describe('Rotas de autenticação (integração)', () => {
    let userInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        execMock.mockReset();
        process.env.SECRET = 'segredo-teste';

        userInstance = { roles: [], save: userSaveMock };
        userModelMock.mockImplementation((data: any) =>
            Object.assign({ roles: [], save: userSaveMock }, data)
        );
    });

    describe('POST /api/auth/signup', () => {
        it('deve cadastrar um novo usuário com 201', async () => {
            execMock.mockResolvedValue(null);
            userSaveMock.mockResolvedValue(userInstance);
            roleFindMock.mockResolvedValue([]);

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'novo@email.com', password: '123456', name: 'Maria', sexo: 'F' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                error: null,
                body: {
                    success: true,
                    data: { message: 'Cadastro realizado com sucesso!' },
                },
            });
        });

        it('deve retornar 400 quando faltam campos obrigatórios', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'novo@email.com' });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('É necessário informar a senha!');
        });

        it('deve retornar 409 quando o email já está em uso', async () => {
            execMock.mockResolvedValue({ email: 'usado@email.com' });

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'usado@email.com', password: '123456', name: 'João', sexo: 'M' });

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                error: { message: 'Este email já está sendo utilizado!' },
                body: null,
            });
        });
    });

    describe('POST /api/auth/signin', () => {
        it('deve retornar 200 com token quando as credenciais são válidas', async () => {
            findOneAwaitedValue = {
                _id: 'user-123',
                name: 'João',
                email: 'joao@email.com',
                password: 'hash-banco',
            };
            (compare as jest.Mock).mockResolvedValue(true);
            (sign as jest.Mock).mockReturnValue('token-gerado');

            const response = await request(app)
                .post('/api/auth/signin')
                .send({ email: 'joao@email.com', password: '123456' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                error: null,
                body: {
                    success: true,
                    data: {
                        name: 'João',
                        email: 'joao@email.com',
                        accessToken: 'token-gerado',
                    },
                },
            });
        });

        it('deve retornar 401 quando as credenciais são inválidas', async () => {
            findOneAwaitedValue = null;

            const response = await request(app)
                .post('/api/auth/signin')
                .send({ email: 'nao.existe@email.com', password: '123456' });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: { message: 'Email ou senha não conferem!' },
                body: null,
            });
        });

        it('deve retornar 400 quando faltam credenciais', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .send({ email: 'joao@email.com' });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('É necessário informar a senha!');
        });
    });

    describe('CORS', () => {
        it('deve rejeitar origem não configurada com 403', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .set('Origin', 'http://evil.example.com')
                .send({ email: 'x@email.com', password: '123456' });

            expect(response.status).toBe(403);
            expect(response.body.error.message).toBe('Origem não permitida pelo CORS');
        });

        it('deve permitir origem local quando CORS_ORIGINS não está definido', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .set('Origin', 'http://localhost:3000')
                .send({ email: 'x@email.com', password: '123456' });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('deve retornar 401 sem token de autorização', async () => {
            const response = await request(app).get('/api/auth/me');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: { message: 'Não autorizado!' },
                body: null,
            });
        });
    });
});