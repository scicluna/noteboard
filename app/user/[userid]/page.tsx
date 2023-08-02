'use client'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import BoardSelector from '@/components/BoardSelector'
import UserDash from '@/components/UserDash'

export default function UserRedirect({ params }: Params) {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            return redirect('/')
        }
    })

    if (!session) return (
        <main className="h-[90dvh] w-full flex justify-center items-center">
            <h1>Loading...</h1>
        </main>
    )
    if (params.userid !== session.user?.id) {
        return redirect('/')
    }
    if (!session.user) {
        return redirect('/')
    }

    return (
        <section className='flex h-[90dvh]'>
            <BoardSelector user={session.user} />
            <UserDash user={session.user} />
        </section>

    )
}