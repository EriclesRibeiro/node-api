import initialRoles from "./role";
import initialUser from "./user";

export default async function populate(): Promise<void> {
    await initialRoles();
    await initialUser();
}