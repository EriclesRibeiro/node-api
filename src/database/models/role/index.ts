import { model, Schema } from "mongoose";

const RoleModel = model("Roles",
    new Schema({
        name: String
    })
);

export default RoleModel;