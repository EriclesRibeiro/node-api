import request from 'supertest';

const execMock: jest.Mock = jest.fn();

const findOneMock: jest.Mock = jest.fn(() => ({
    exec: execMock,
    then(onFulfilled: (value: unknown) => void) {
        onFulfilled(null);
    },
}));

const userModelMock: jest.Mock = jest.fn();

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: Object.assign(userModelMock, { findOne: findOneMock }),
        role: {
            find: jest.fn(),
        },
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

describe('Rate limiter nas rotas de autenticação', () => {
    const credentials = { email: 'teste@email.com', password: '123456' };

    it('bloqueia com 429 após atingir o limite de requisições', async () => {
        for (let i = 0; i < 20; i++) {
            const response = await request(app)
                .post('/api/auth/signin')
                .send(credentials);

            expect(response.status).toBe(401);
        }

        const blocked = await request(app)
            .post('/api/auth/signin')
            .send(credentials);

        expect(blocked.status).toBe(429);
    });
});