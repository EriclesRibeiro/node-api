import { NextFunction, Request, Response } from "express";
import db from "../../../database/models";
import { AppError } from "../../../utils/error";
import Constant from "../../../utils/constants";

const User = db.user;

class Verifier {
   async verifyEmail(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;

      if (typeof email !== 'string' || !email) {
         throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);
      }

      try {
         const user = await User.findOne({
            email: email
         }).exec();

         if (user) {
            return res.status(Constant.SUCCESS).json({
               error: null,
               body: {
                  success: false,
                  message: "Este email já está sendo utilizado!"
               }
            })
         }

         return next();
      } catch (error) {
         return next(new AppError("Algo deu errado! Por favor, tente novamente mais tarde!!", Constant.GENERIC_ERROR));
      }
   }
}

export { Verifier }