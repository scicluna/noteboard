import { getCookie } from "./getBoards";

export async function getBoardName(boardid: string) {
    const cookie = await getCookie('next-auth.session-token');
    const res = await fetch(`${process.env.URL}/api/board/${boardid}`, {
        credentials: "include", headers: {
            Cookie: `next-auth.session-token=${cookie}`
        }
    })
    const boardName = await res.json()

    if (!boardName) {
        return null
    }

    return boardName
}