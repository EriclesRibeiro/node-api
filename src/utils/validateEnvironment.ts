import 'dotenv/config';

export function validateEnvironment(): void {
    const missing: string[] = [];

    const { MONGO_URI, SECRET } = process.env;

    if (!MONGO_URI) {
        missing.push('MONGO_URI');
    }

    if (!SECRET) {
        missing.push('SECRET');
    } else if (SECRET.length < 32) {
        missing.push('SECRET (mínimo de 32 caracteres para assinatura JWT)');
    }

    if (!process.env.PORT && !process.env.LOCAL_PORT) {
        missing.push('PORT/LOCAL_PORT');
    }

    if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias ausentes ou inválidas: ${missing.join(', ')}`);
    }
}

validateEnvironment();