import db from "../../../database/models";

const User = db.user;

module.exports = {
   
   verifyEmail(req: any, res: any, next: () => void) {
      const email = req.body.email;
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
               error: null,
               body: {
                  success: false,
                  data: { message: "Já existe um usuário cadastrado com esse email!" }
               }
           })
         }
         next();
      });
   }
}