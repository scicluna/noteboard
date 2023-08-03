import { BoardUser } from "@/components/BoardSelector"

export async function getBoards(user: BoardUser) {
    const res = await fetch(`${process.env.URL}/api/board/${user.id}`)
    const boards = await res.json()
    if (boards == 'Failed to find boards') {
        return null
    }
    return boards
}