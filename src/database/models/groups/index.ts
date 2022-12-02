import { model, Schema, Types } from "mongoose";

const GroupModel = model("Groups", 
    new Schema({
        name: String,
        description: String,
        created_at: String,
        updated_at: String,
        hashcode: String,
        owner: {
            type: Types.ObjectId,
            ref: "Users"
        },
        members: [
            {
                type: Types.ObjectId,
                ref: "Users"
            }
        ]
    })
);

export default GroupModel;