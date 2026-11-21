process.env.MONGO_URI = 'mongodb://localhost:27017/test';
process.env.SECRET = 'segredo-de-teste-com-pelo-menos-32-caracteres';
process.env.PORT = '3000';
process.env.LOCAL_PORT = '';

const { validateEnvironment } = require('../../src/utils/validateEnvironment');

describe('validateEnvironment', () => {
    beforeEach(() => {
        process.env.MONGO_URI = 'mongodb://localhost:27017/test';
        process.env.SECRET = 'segredo-de-teste-com-pelo-menos-32-caracteres';
        process.env.PORT = '3000';
        process.env.LOCAL_PORT = '';
    });

    it('não lança quando as variáveis obrigatórias estão definidas', () => {
        expect(() => validateEnvironment()).not.toThrow();
    });

    it('lança quando MONGO_URI está ausente', () => {
        process.env.MONGO_URI = '';
        expect(() => validateEnvironment()).toThrow(/MONGO_URI/);
    });

    it('lança quando SECRET está ausente', () => {
        process.env.SECRET = '';
        expect(() => validateEnvironment()).toThrow(/SECRET/);
    });

    it('lança quando SECRET possui menos de 32 caracteres', () => {
        process.env.SECRET = 'chave-curta';
        expect(() => validateEnvironment()).toThrow(/SECRET/);
    });

    it('lança quando PORT e LOCAL_PORT estão ausentes', () => {
        process.env.PORT = '';
        process.env.LOCAL_PORT = '';
        expect(() => validateEnvironment()).toThrow(/PORT\/LOCAL_PORT/);
    });

    it('aceita LOCAL_PORT quando PORT está ausente', () => {
        process.env.PORT = '';
        process.env.LOCAL_PORT = '4000';
        expect(() => validateEnvironment()).not.toThrow();
    });
});