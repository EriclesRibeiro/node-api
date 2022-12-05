import { Response, Request, NextFunction } from "express";

const tryCatch = (controller: any) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        await controller(request, response);
    } catch (error) {
        return next(error);
    }
}

export default tryCatch