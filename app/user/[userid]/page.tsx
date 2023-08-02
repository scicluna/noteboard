import { redirect } from 'next/navigation'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import BoardSelector from '@/components/BoardSelector'
import UserDash from '@/components/UserDash'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'


export default async function UserPage({ params }: Params) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/')
    }

    if (session?.user?.id !== params.userid) {
        redirect('/')
    }

    return (
        <section className='flex h-[90dvh]'>
            <BoardSelector user={session.user} />
            <UserDash user={session.user} />
        </section>

    )
}