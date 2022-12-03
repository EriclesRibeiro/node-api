import { NextFunction, Request, Response } from "express";
import db from "../../../database/models";

const User = db.user;

class Verifier {
   verifyEmail(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;
      if(!email) {
         return res.status(422).json({
             error: {
                 message: "É necessário informar o email para verificação!"
             },
             body: null
         });
      }
      User.findOne({
         email: email
      }).exec((err, user) => {
         if (err) {
            return res.status(500).json({
               error: {
                  message: err
               },
               body: null
           })
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