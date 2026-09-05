import { AppError } from '../../src/utils/error';

describe('AppError', () => {
    it('deve ser uma instância de Error e AppError', () => {
        const error = new AppError('Mensagem de erro', 400);
        expect(error).toBeInstanceOf(AppError);
        expect(error).toBeInstanceOf(Error);
    });

    it('deve armazenar a mensagem corretamente', () => {
        const message = 'Erro interno';
        const error = new AppError(message, 500);
        expect(error.message).toBe(message);
    });

    it('deve armazenar o statusCode corretamente', () => {
        const error = new AppError('Requisição inválida', 400);
        expect(error.statusCode).toBe(400);
    });

    it('deve reter a stack trace de Error', () => {
        const error = new AppError('Erro', 500);
        expect(error).toHaveProperty('stack');
    });
});
