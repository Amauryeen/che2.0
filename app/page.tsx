import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    return (
        <div>
            <p>Bonjour <b>{session?.user?.email}</b>!</p>
        </div>
    );
}