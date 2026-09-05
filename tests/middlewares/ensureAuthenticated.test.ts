import { Request, Response, NextFunction } from 'express';
import { ensureAuthenticated } from '../../src/app/middlewares/ensureAuthenticated';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

jest.mock('../../src/database/models', () => ({
    __esModule: true,
    default: {
        user: {
            findById: jest.fn(),
        },
        role: {},
    },
}));

import { verify } from 'jsonwebtoken';
import db from '../../src/database/models';

describe('ensureAuthenticated', () => {
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockNext = () => jest.fn() as unknown as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SECRET = 'segredo';
    });

    it('deve retornar 401 quando não há header de autorização', () => {
        const req = { headers: {} } as Request;
        const res = mockResponse();
        const next = mockNext();

        ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Não autorizado!' },
            body: null,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o token é inválido', () => {
        const req = { headers: { authorization: 'Bearer token-invalido' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (verify as jest.Mock).mockImplementation(() => {
            throw new Error('token inválido');
        });

        ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Token inválido!' },
            body: null,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o header não usa o esquema Bearer', () => {
        const req = { headers: { authorization: 'token-sem-scheme' } } as Request;
        const res = mockResponse();
        const next = mockNext();

        ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Não autorizado!' },
            body: null,
        });
        expect(verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() quando o token é válido e o usuário existe', async () => {
        const req = { headers: { authorization: 'Bearer token-valido' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
        (db.user.findById as jest.Mock).mockResolvedValue({ _id: 'user-123', roles: [] });

        await ensureAuthenticated(req, res, next);

        expect(verify).toHaveBeenCalledWith('token-valido', 'segredo');
        expect(db.user.findById).toHaveBeenCalledWith('user-123');
        expect(req.user).toEqual({ sub: 'user-123' });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o usuário não existe no banco', async () => {
        const req = { headers: { authorization: 'Bearer token-valido' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (verify as jest.Mock).mockReturnValue({ sub: 'user-inexistente' });
        (db.user.findById as jest.Mock).mockResolvedValue(null);

        await ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Não autorizado!' },
            body: null,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando o payload não é um objeto', async () => {
        const req = { headers: { authorization: 'Bearer token-valido' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (verify as jest.Mock).mockReturnValue('apenas-string');

        await ensureAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Token inválido!' },
            body: null,
        });
        expect(next).not.toHaveBeenCalled();
    });
});
