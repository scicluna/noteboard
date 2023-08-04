import { getCookie } from "./getBoards";

export async function getNotes(boardid: string) {
    const cookie = await getCookie('next-auth.session-token');
    const res = await fetch(`${process.env.URL}/api/notes/${boardid}`, {
        credentials: "include", headers: {
            Cookie: `next-auth.session-token=${cookie}`
        }
    })
    const notes = await res.json()

    if (!notes?.length) {
        return null
    }

    return notes
}