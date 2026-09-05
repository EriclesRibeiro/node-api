import { Request, Response, NextFunction } from 'express';
import { Verifier } from '../../src/app/middlewares/verifiers';
import { AppError } from '../../src/utils/error';

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

describe('Verifier', () => {
    const verifier = new Verifier();

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockNext = () => jest.fn() as unknown as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve lançar AppError quando o email não é informado', () => {
        const req = { body: {} } as Request;
        const res = mockResponse();
        const next = mockNext();

        expect(() => verifier.verifyEmail(req, res, next)).toThrow(AppError);
        expect(db.user.findOne).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando o email já está em uso', () => {
        const req = { body: { email: 'existente@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();

        (db.user.findOne as jest.Mock).mockReturnValue({
            exec: (cb: any) => cb(null, { email: 'existente@email.com' }),
        });

        verifier.verifyEmail(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            error: null,
            body: {
                success: false,
                message: 'Este email já está sendo utilizado!',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve lançar AppError genérico quando ocorre erro no banco', () => {
        const req = { body: { email: 'teste@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();

        (db.user.findOne as jest.Mock).mockReturnValue({
            exec: (cb: any) => cb(new Error('falha')),
        });

        expect(() => verifier.verifyEmail(req, res, next)).toThrow(AppError);
    });

    it('deve chamar next() quando o email está disponível', () => {
        const req = { body: { email: 'novo@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();

        (db.user.findOne as jest.Mock).mockReturnValue({
            exec: (cb: any) => cb(null, null),
        });

        verifier.verifyEmail(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
});
