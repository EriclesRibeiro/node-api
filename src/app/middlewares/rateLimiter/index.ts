import rateLimit from 'express-rate-limit';

// A mesma instância é compartilhada pelas rotas de autenticação, ou seja,
// signup e signin somam o contador do mesmo IP (20 tentativas / 15 min por cliente).
// O store é em memória: em deployments com múltiplas instâncias o limite não é global.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: { message: 'Muitas tentativas! Tente novamente mais tarde.' },
        body: null
    }
});

export { authLimiter };