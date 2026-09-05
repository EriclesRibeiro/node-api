import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/app/middlewares/errorHandler';
import { AppError } from '../../src/utils/error';

describe('errorHandler', () => {
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockNext = () => jest.fn() as unknown as NextFunction;

    it('deve responder com statusCode e mensagem do AppError', () => {
        const error = new AppError('Requisição inválida', 400);
        const res = mockResponse();
        const next = mockNext();

        errorHandler(error, {} as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: { message: 'Requisição inválida' },
            body: null,
        });
    });

    it('deve responder com 500 para erros genéricos e registrar o erro', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const error = new Error('Erro inesperado');
        const res = mockResponse();
        const next = mockNext();

        errorHandler(error, {} as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: { message: 'Algo deu errado! Por favor, tente novamente mais tarde!' },
            body: null,
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro não tratado:', error);
        consoleErrorSpy.mockRestore();
    });
});
