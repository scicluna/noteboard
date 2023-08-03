'use client'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RedirectType } from 'next/dist/client/components/redirect'

export default function UserRedirect() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            return redirect('/')
        }
    })
    if (!session) return (
        <main className="h-full w-full flex justify-center items-center">
            <h1>Loading...</h1>
        </main >)

    return redirect(`/user/${session.user?.id}`)
}