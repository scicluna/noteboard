import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Board from '@/components/client/Board'
import { getBoardName } from '@/utils/getBoardName'
import { getNotes } from '@/utils/getNotes'
import { Note } from '@/components/server/BoardSelector'
import { getConnections } from '@/utils/getConnections'

export default async function Canvas({ params }: { params: { userid: string, boardid: string } }) {
    const session = await getServerSession(authOptions)
    const { userid, boardid } = params
    const notes = await getNotes(boardid)
    const connections = getConnections(notes)
    const name = await getBoardName(boardid)
    const maxZ = Math.max(notes?.map((note: Note) => note.zIndex), 0);

    if (!session || !session.user) return (
        <main className="h-full w-full flex justify-center items-center">
            <h1>Loading...</h1>
        </main >
    )

    return (
        <Board notes={notes} user={session.user} ownerid={userid} name={name} boardid={boardid} maxZ={maxZ} connections={connections} />
    )
}