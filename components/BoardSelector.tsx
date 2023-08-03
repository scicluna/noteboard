import CreateNewBoard from "./CreateNewBoard";
import { getBoards } from "@/utils/getBoards";

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
    boardid: string
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
        <section className="h-[90dvh] w-1/4 p-4 relative shadow-sm shadow-gray-300 overflow-auto">
            <CreateNewBoard user={user} />
            <div className="flex flex-col gap-4 mt-10">
                {boards ? boards.map(board => (
                    <a href={`/user/${user.id}/board/${board._id}`} key={board._id}>
                        <div className="relative flex justify-center items-center w-full h-24 bg-orange-100 shadow-sm shadow-gray-400">
                            <p className="font-extrabold">{board.name}</p>
                            <p className="absolute bottom-0 right-0">Trash</p>
                        </div>
                    </a>
                )) : <p>There are no boards yet...</p>}
            </div>
        </section>
    )
}