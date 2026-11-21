import { ErrorRequestHandler } from 'express'
import { AppError } from '../../../utils/error';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    
    if (error instanceof AppError) {
        return response.status(error.statusCode).send({
            error: { 
                message: error.message 
            },
            body: null
        });
    }

    console.error(
        'Erro não tratado:',
        error instanceof Error ? `${error.message}\n${error.stack}` : error
    );

    return response.status(500).send({
        error: { 
            message: "Algo deu errado! Por favor, tente novamente mais tarde!"
        },
        body: null
    });
}

export { errorHandler };