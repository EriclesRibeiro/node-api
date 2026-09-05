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

    const mockFindOneResult = (value: unknown) => {
        (db.user.findOne as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(value),
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve rejeitar quando o email não é informado', async () => {
        const req = { body: {} } as Request;
        const res = mockResponse();
        const next = mockNext();

        await expect(verifier.verifyEmail(req, res, next)).rejects.toThrow(AppError);
        expect(db.user.findOne).not.toHaveBeenCalled();
    });

    it('deve rejeitar quando o email não é uma string', async () => {
        const req = { body: { email: ['a@b.com'] } } as Request;
        const res = mockResponse();
        const next = mockNext();

        await expect(verifier.verifyEmail(req, res, next)).rejects.toThrow(AppError);
        expect(db.user.findOne).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando o email já está em uso', async () => {
        const req = { body: { email: 'existente@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        mockFindOneResult({ email: 'existente@email.com' });

        await verifier.verifyEmail(req, res, next);

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

    it('deve chamar next com AppError quando ocorre erro no banco', async () => {
        const req = { body: { email: 'teste@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        (db.user.findOne as jest.Mock).mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('falha no banco')),
        });

        await verifier.verifyEmail(req, res, next);

        const nextMock = next as unknown as jest.Mock;
        expect(res.status).not.toHaveBeenCalled();
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(expect.any(AppError));
        expect((nextMock.mock.calls[0][0] as AppError).statusCode).toBe(500);
    });

    it('deve chamar next() quando o email está disponível', async () => {
        const req = { body: { email: 'novo@email.com' } } as Request;
        const res = mockResponse();
        const next = mockNext();
        mockFindOneResult(null);

        await verifier.verifyEmail(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
});