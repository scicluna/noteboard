'use client'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

export default function UserRedirect({ params }: Params) {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            return redirect('/')
        }
    })

    if (!session) return <h1>Loading...</h1>
    if (params.userid !== session.user?.id) {
        return redirect('/')
    }

    return <h1>{session.user?.name} Dash</h1>
}