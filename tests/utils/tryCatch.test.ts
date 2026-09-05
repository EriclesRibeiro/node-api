import { Request, Response, NextFunction } from 'express';
import tryCatch from '../../src/utils/tryCatch';

describe('tryCatch', () => {
    const makeResponse = (): Response => ({} as Response);

    const makeRequest = (): Request => ({} as Request);

    it('deve executar o controller com sucesso e não chamar next', async () => {
        const controller = jest.fn().mockResolvedValue(undefined);
        const wrapped = tryCatch(controller);
        const next = jest.fn() as jest.MockedFunction<NextFunction>;

        await wrapped(makeRequest(), makeResponse(), next);

        expect(controller).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it('deve passar o erro para next quando o controller lança', async () => {
        const error = new Error('Falha qualquer');
        const controller = jest.fn().mockRejectedValue(error);
        const wrapped = tryCatch(controller);
        const next = jest.fn() as jest.MockedFunction<NextFunction>;

        await wrapped(makeRequest(), makeResponse(), next);

        expect(controller).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('deve repassar request, response para o controller', async () => {
        const controller = jest.fn().mockResolvedValue(undefined);
        const wrapped = tryCatch(controller);
        const request = makeRequest();
        const response = makeResponse();
        const next = jest.fn() as jest.MockedFunction<NextFunction>;

        await wrapped(request, response, next);

        expect(controller).toHaveBeenCalledWith(request, response);
    });
});
