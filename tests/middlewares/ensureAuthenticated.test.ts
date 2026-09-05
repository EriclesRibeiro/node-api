import { Request, Response, NextFunction } from 'express';
import { ensureAuthenticated } from '../../src/app/middlewares/ensureAuthenticated';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

import { verify } from 'jsonwebtoken';

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

    it('deve chamar next() quando o token é válido', () => {
        const req = { headers: { authorization: 'Bearer token-valido' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (verify as jest.Mock).mockReturnValue({});

        ensureAuthenticated(req, res, next);

        expect(verify).toHaveBeenCalledWith('token-valido', 'segredo');
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
});
