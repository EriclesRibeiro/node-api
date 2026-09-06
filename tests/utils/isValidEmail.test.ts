import isValidEmail from '../../src/utils/isValidEmail';

describe('isValidEmail', () => {
    it('retorna true para um email válido', () => {
        expect(isValidEmail('joao@email.com')).toBe(true);
    });

    it('retorna false para email sem domínio', () => {
        expect(isValidEmail('joao@email')).toBe(false);
    });

    it('retorna false para email sem arroba', () => {
        expect(isValidEmail('joao.email.com')).toBe(false);
    });

    it('retorna false para email com espaços', () => {
        expect(isValidEmail('joao @email.com')).toBe(false);
    });

    it('retorna false para string vazia', () => {
        expect(isValidEmail('')).toBe(false);
    });
});