import { BoardUser } from "@/components/server/BoardSelector";

export async function newBoard(e: any, user: BoardUser, name: string) {
    e.preventDefault()
    const res = await fetch(`/api/boards/${user.id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    const newBoard = await res.json()
    if (!newBoard) {
        return null
    }
    return newBoard
}