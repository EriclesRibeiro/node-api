import mongoose from "mongoose";
import db from "../../models";

export default function initialRoles() {
    const Role = db.role;
    Role.estimatedDocumentCount((err: any, count: number) => {
        if (!err && count === 0) {
            new Role({
                name: "authenticated"
            }).save(err => {
                if (err) {
                    console.log("error when trying to add role 'authenticated'", err);
                }

                console.log("addes 'authenticated' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error when trying to add role 'admin'", err);
                }

                console.log("addes 'admin' to roles collection");
            });
        }
    });
}