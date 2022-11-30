import mongoose from "mongoose";
import 'dotenv/config';

const mongoURI = process.env.MONGO_URI;

export default function connectMongoose(): void {
    if (mongoURI){
        mongoose.connect(mongoURI, () => console.log("Connected to MongoDB!"));
    } else {
        console.log("Failed to connect to MongoDB!")
    }
}