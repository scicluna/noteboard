type UserDashProps = {
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        id?: string | null | undefined;
    }
}

export default function UserDash({ user }: UserDashProps) {
    return (
        <section className="h-[90dvh] pt-[10dvh] w-3/4 p-4">
            <h1>User</h1>
        </section>
    )
}