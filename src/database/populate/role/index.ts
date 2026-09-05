import db from "../../models";

export default async function initialRoles(): Promise<void> {
    const Role = db.role;
    const count = await Role.estimatedDocumentCount();

    if (count > 0) {
        return;
    }

    await Role.create({ name: db.ROLES.AUTHENTICATED });
    await Role.create({ name: db.ROLES.ADMIN });
    console.log("added 'authenticated' and 'admin' to roles collection");
}