import db from "../../models";
import dateFormated from "../../../utils/dateFormated";
import { hashSync } from "bcrypt";

export default async function initialUser(): Promise<void> {
    const User = db.user;
    const Role = db.role;
    const count = await User.estimatedDocumentCount();

    if (count > 0) {
        return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidos para popular o usuário administrador!");
    }

    const currentDate = dateFormated(new Date());

    const user = new User({
        name: "administrator",
        categories: [],
        created_at: currentDate,
        updated_at: currentDate,
        password: hashSync(adminPassword, 12),
        email: adminEmail,
        roles: []
    });
    await user.save();

    const roles = await Role.find({
        name: { $in: ['admin'] }
    });

    user.roles = roles.map((role: any) => role._id);
    await user.save();
    console.log("added 'administrator' to Users collection");
}