import mongoose from "mongoose";
import db from "../../models";
import dateFormated from "../../../utils/dateFormated";

export default function initialUser() {
    const User = db.user;
    const Role = db.role;
    User.estimatedDocumentCount((err: any, count: number) => {
        const currentDate = dateFormated(new Date())
        if (!err && count === 0) {
            const user = new User({
                name: "administrator",
                categories: [],
                created_at: currentDate,
                updated_at: currentDate,
                password: "admin",
                email: "admin@cronos.io",
                roles: []
            });
            user.save((err, user) => {
                if (err) {
                    console.log("error when trying to add User 'administrator'", err);
                }
                Role.find({
                    name: { $in: 'admin' }
                }, (err: any, roles: any) => {
                    if (err) {
                        console.log("error when trying to add role 'admin' in the user 'administrator'", err);
                    }
                    user.roles = roles.map((role:any) => role._id)
                    user.save(err => {
                        if (err) {
                            console.log("error when trying to save the user 'admin' with role")
                        }
                        console.log("addes 'administrator' to Users collection");
                    })
                })
            });
        }
    });
}