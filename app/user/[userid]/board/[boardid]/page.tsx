import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Board from '@/components/client/Board'
import { getBoardName } from '@/utils/getBoardName'
import { getNotes } from '@/utils/getNotes'

export default async function Canvas({ params }: { params: { userid: string, boardid: string } }) {
    const session = await getServerSession(authOptions)
    const { userid, boardid } = params
    const notes = await getNotes(boardid)
    const name = await getBoardName(boardid)

    if (!session || !session.user) return (
        <main className="h-full w-full flex justify-center items-center">
            <h1>Loading...</h1>
        </main >
    )

    return (
        <Board notes={notes} user={session.user} ownerid={userid} name={name} boardid={boardid} />
    )
}