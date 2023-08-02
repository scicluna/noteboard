import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getBoards } from "@/utils/getBoards";

type BoardSelectorProps = {
    user: BoardUser
}

export type BoardUser = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id?: string | null | undefined;
}

export type Board = {
    owner: string
    id: string
    name: string
    notes: Note[]
}

export type Note = {
    text: string
    image: string
    width: number
    height: number
    top: number
    left: number
}

export default async function BoardSelector({ user }: BoardSelectorProps) {
    const boards: Board[] = await getBoards(user)

    return (
        <section className="h-[90dvh] w-1/4 p-4 relative">
            <button className="fixed">
                <FontAwesomeIcon icon={faPlus} width={30} height={30} color="gray" className="hover:text-black" />
            </button>
            <div className="flex flex-col gap-4">
                {boards ? boards.map(board => (
                    <a href={board.id} key={board.id}>
                        <h1>{board.name}</h1>
                    </a>
                )) : <p>There are no boards yet...</p>}
            </div>
        </section>
    )
}