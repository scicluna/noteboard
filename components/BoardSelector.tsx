type BoardSelectorProps = {
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        id?: string | null | undefined;
        online?: boolean | null | undefined;
    }
}

export default function BoardSelector({ user }: BoardSelectorProps) {
    return (
        <section className="h-[90dvh] w-1/4 p-2">
            <h1>Board Selector</h1>
        </section>
    )
}