import { model, Schema, Types } from "mongoose";

const ProjectModel = model("Projects", 
    new Schema({
        name: String,
        owner: {
            type: Types.ObjectId,
            ref: "Users"
        },
        description: String,
        members: [{
            type: Types.ObjectId,
            ref: "Users"
        }],
        private: Boolean,
        created_at: String,
        updated_at: String,
        identifier: String,
        categorie: String,
        repositorie: String
    })
);

export default ProjectModel;