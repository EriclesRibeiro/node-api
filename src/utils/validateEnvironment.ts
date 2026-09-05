import 'dotenv/config';

export function validateEnvironment(): void {
    const missing: string[] = [];

    const variables: Record<string, string | undefined> = {
        MONGO_URI: process.env.MONGO_URI,
        SECRET: process.env.SECRET,
    };

    Object.entries(variables).forEach(([name, value]) => {
        if (!value) {
            missing.push(name);
        }
    });

    if (!process.env.PORT && !process.env.LOCAL_PORT) {
        missing.push('PORT/LOCAL_PORT');
    }

    if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`);
    }
}

validateEnvironment();