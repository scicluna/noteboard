import { BoardUser } from "@/components/server/BoardSelector";

export async function deleteBoard(user: BoardUser, boardid: string) {
    const res = await fetch(`/api/boards/${user.id}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ boardid }) })
    const newBoard = await res.json()
    if (!newBoard) {
        return null
    }
    return newBoard
}