import { NextFunction, Request, Response } from "express";
import db from "../../../database/models";
import { AppError } from "../../../utils/error";
import Constant from "../../../utils/constants";

const User = db.user;

class Verifier {
   verifyEmail(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;

      if (!email) throw new AppError("É necessário informar o email!", Constant.BAD_REQUEST);;

      User.findOne({
         email: email
      }).exec((err, user) => {
         if (err) {
            throw new AppError("Algo deu errado! Por favor, tente novamente mais tarde!!", Constant.GENERIC_ERROR);
         }
         if (user) {
            return res.status(Constant.SUCCESS).json({
               error: null,
               body: {
                  success: false,
                  message: "Este email já está sendo utilizado!"
               }
            })
         }
         next();
      });
   }
}

export { Verifier }