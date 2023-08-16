import CreateNewBoard from "../client/CreateNewBoard";
import { getBoards } from "@/utils/getBoards";
import TrashBoard from "../client/TrashBoard";

export type BoardSelectorProps = {
    user: BoardUser
}

export type BoardUser = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id?: string | null | undefined;
}

export type Board = {
    _id: string
    ownerid: string
    name: string
}

export type Note = {
    id?: string
    tempid: string
    boardid: string
    text: string
    image?: string
    width: string
    height: string
    top: string
    left: string
    fontSize: string
    zIndex: number
    connectedNotes?: string[]
}

export default async function BoardSelector({ user }: BoardSelectorProps) {
    const boards: Board[] = await getBoards(user)
    return (
        <section className="h-[90dvh] pt-[10dvh] w-1/4 p-4 relative shadow-sm shadow-gray-300 overflow-auto">
            <CreateNewBoard user={user} />
            <div className="flex flex-col gap-4 mt-10">
                {boards ? boards.map(board => (
                    <div className="relative" key={board._id}>
                        <a href={`/user/${user.id}/board/${board._id}`}>
                            <div className="flex justify-center items-center w-full h-24 bg-orange-100 shadow-sm shadow-gray-400">
                                <p className="font-extrabold">{board.name}</p>
                            </div>
                        </a>
                        <TrashBoard user={user} boardid={board._id} />
                    </div>
                )) : <p>There are no boards yet...</p>}
            </div>
        </section>
    )
}