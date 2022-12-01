import db from "../../database/models";
const User = db.user;
const Role = db.role;

// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
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
                    data: null
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
                        data: null
                    })
                }
                if (user) {
                    return res.status(200).json({
                        error: null,
                        data: {exists: true}
                    })
                }
                return res.status(200).json({
                    error: null,
                    data: {exists: false}
                })
            })
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: error
                },
                data: null
            });
        }
        
    },
    async signup(req:any, res:any) {
        
    }
}