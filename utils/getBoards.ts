import { BoardUser } from "@/components/server/BoardSelector";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? '';
}

export async function getBoards(user: BoardUser) {
    const cookie = await getCookie('next-auth.session-token');
    const res = await fetch(`${process.env.URL}/api/boards/${user.id}`, {
        credentials: "include", headers: {
            Cookie: `next-auth.session-token=${cookie}`
        }
    })
    const boards = await res.json()

    if (!boards?.length) {
        return null
    }

    return boards
}