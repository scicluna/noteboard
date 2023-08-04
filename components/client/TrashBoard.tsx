'use client'
import { BoardUser } from "../server/BoardSelector"
import { deleteBoard } from "@/utils/deleteBoard";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

type TrashBoardProps = {
    user: BoardUser
    boardid: string
}

export default function TrashBoard({ user, boardid }: TrashBoardProps) {
    const router = useRouter()

    async function initDeleteBoard(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        await deleteBoard(user, boardid)
        router.refresh()
    }

    return (
        <button onClick={initDeleteBoard} className="absolute bottom-0 right-0">Trash</button>
    )
}