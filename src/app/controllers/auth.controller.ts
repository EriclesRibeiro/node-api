import db from "../../database/models";
import dateFormated from "../../utils/dateFormated";
import bcrypt from 'bcrypt';

const User = db.user;
const Role = db.role;

// const jwt = require("jsonwebtoken");
// const { get } = require("mongoose");

module.exports = {
    async verifyEmail(req: any, res: any) {
        try {
            const { email } = req.query

            if (!email) {
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
                    });
                }
                if (user) {
                    return res.status(200).json({
                        error: null,
                        body: {
                            success: true,
                            data: { exists: true }
                        }
                    });
                }
                return res.status(200).json({
                    error: null,
                    body: {
                        succcess: true,
                        data: { exists: false }
                    }
                });
            })
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: error
                },
                body: null
            });
        }
        
    },
    async signup(req:any, res:any) {
        try {
            const {email, name, password, sexo} = req.body;
            if(!email) {
                return res.status(422).json({
                    error: {
                        message: "É necessário informar o email!"
                    },
                    body: null
                });
            }
            if(!name) {
                return res.status(422).json({
                    error: {
                        message: "É necessário informar o nome!"
                    },
                    body: null
                });
            }
            if(!password) {
                return res.status(422).json({
                    error: {
                        message: "É necessário informar a senha!"
                    },
                    body: null
                });
            }
            if(!sexo) {
                return res.status(422).json({
                    error: {
                        message: "É necessário informar o sexo!"
                    },
                    body: null
                });
            }
            const currentDate = dateFormated(new Date());
            const user = new User({
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
                categories: [],
                created_at: currentDate,
                updated_at: currentDate,
                roles: []
            })
            user.save((err, user) => {
                if(err) {
                    return res.status(500).json({
                        error: {
                            message: err
                        },
                        body: null
                    });
                }
                Role.find({
                    name: { $in: 'authenticated' }
                }, (err: any, roles: any) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                message: err
                            },
                            body: null
                        });
                    }
                    user.roles = roles.map((role:any) => role._id)
                    user.save(err => {
                        if (err) {
                            return res.status(500).json({
                                error: null,
                                body: {
                                    success: false,
                                    data: { message: "Erro ao cadastrar! Por favor tente denovo mais tarde!" }
                                }
                            });
                        }
                        return res.status(500).json({
                            error: null,
                            body: {
                                success: true,
                                data: { message: "Cadastro realizado com sucesso!" }
                            }
                        });
                    })
                })
            })
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: error
                },
                body: null
            });
        }
    }
}