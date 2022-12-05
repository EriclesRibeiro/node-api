import { NextFunction, Request, Response } from "express";
import db from "../../../database/models";
import { AppError } from "../../../utils/error";
import Constant from "../../../utils/constants";

const User = db.user;

class Verifier {
   verifyEmail(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;

      let errorMessage;
      if (!email) {errorMessage = "É necessário informar o email!"};

      if (errorMessage) {throw new AppError(errorMessage, Constant.BAD_REQUEST)};

      User.findOne({
         email: email
      }).exec((err, user) => {
         if (err) {
            throw new AppError("Algo deu errado! Por favor, tente novamente mais tarde!!", Constant.BAD_REQUEST);
         }
         if (user) {
            return res.status(500).json({
               error: {
                  message: "Já existe um usuário cadastrado com esse email!"
               },
               body: null
            })
         }
         next();
      });
   }
}

export { Verifier }