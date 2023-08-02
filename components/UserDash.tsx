type UserDashProps = {
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        id?: string | null | undefined;
        online?: boolean | null | undefined;
    }
}

export default function UserDash({ user }: UserDashProps) {
    return (
        <section className="h-[90dvh] w-3/4 p-2">
            <h1>User</h1>
        </section>
    )
}