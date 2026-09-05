import 'dotenv/config';
import './utils/validateEnvironment';
import app from './app';
import connectMongoose from './database';

const PORT = process.env.PORT || process.env.LOCAL_PORT;

async function start(): Promise<void> {
    await connectMongoose();
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

start().catch((error) => {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
});