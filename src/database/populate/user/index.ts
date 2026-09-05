import db from "../../models";
import dateFormatted from "../../../utils/dateFormatted";
import { hash } from "bcrypt";

export default async function initialUser(): Promise<void> {
    const User = db.user;
    const Role = db.role;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidos para popular o usuário administrador!");
    }

    const existing = await User.findOne({
        email: adminEmail
    });

    if (existing) {
        return;
    }

    const currentDate = dateFormatted(new Date());

    const user = new User({
        name: "administrator",
        categories: [],
        created_at: currentDate,
        updated_at: currentDate,
        password: await hash(adminPassword, 12),
        email: adminEmail,
        roles: []
    });

    try {
        await user.save();

        const roles = await Role.find({
            name: db.ROLES.ADMIN
        });

        user.roles = roles.map((role: any) => role._id);
        await user.save();
        console.log("added 'administrator' to Users collection");
    } catch (error) {
        if ((error as { code?: number }).code !== 11000) {
            throw error;
        }
    }
}