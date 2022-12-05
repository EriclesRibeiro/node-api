import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../../utils/error';

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {

    if (error.name === 'ValidationError') {
        return response.status(400).send({
            error: { 
                message: error.message 
            },
            body: null
        });
    }
    
    if (error instanceof AppError) {
        return response.status(error.statusCode).send({
            error: { 
                message: error.message 
            },
            body: null
        });
    }

    return response.status(500).send({
        error: { 
            message: "Algo deu errado! Por favor, tente novamente mais tarde!"
        },
        body: null
    });
}

export default errorHandler;