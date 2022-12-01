import { model, Schema, Types } from "mongoose";

const UserModel = model("Users", 
    new Schema({
        name: String,
        categories: Array,
        created_at: String,
        updated_at: String,
        password: String,
        email: String,
        roles: [
            {
                type: Types.ObjectId,
                ref: "Roles"
            }
        ]
    })
);

export default UserModel;