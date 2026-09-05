import mongoose from "mongoose";
import 'dotenv/config';
import populate from "./populate";

export default async function connectMongoose(): Promise<void> {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI não definida!");
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB!");
    await populate();
}