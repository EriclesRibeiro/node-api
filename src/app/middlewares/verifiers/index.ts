import { NextFunction, Request, Response } from "express";
import db from "../../../database/models";
import normalizeEmail from "../../../utils/normalizeEmail";
import { AppError } from "../../../utils/error";
import Constant from "../../../utils/constants";

const User = db.user;

class Verifier {
   async verifyEmail(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;

      if (typeof email !== 'string' || !email) {
         throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
      }

      const normalizedEmail = normalizeEmail(email);

      try {
         const user = await User.findOne({
            email: normalizedEmail
         }).exec();

         if (user) {
            return next(new AppError("Este email já está sendo utilizado!", Constant.CONFLICT));
         }

         return next();
      } catch (error) {
         return next(new AppError("Algo deu errado! Por favor, tente novamente mais tarde!!", Constant.GENERIC_ERROR));
      }
   }
}

export { Verifier }