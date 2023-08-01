'use client'
import { BuiltInProviderType } from "next-auth/providers/index"
import { signIn, getProviders, useSession, ClientSafeProvider, LiteralUnion } from "next-auth/react"
import { useState, useEffect, MouseEventHandler, FormEventHandler, FormEvent } from 'react'
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string>()

  useEffect(() => {
    async function startProviders() {
      const response = await getProviders()
      setProviders(response)
    }
    startProviders()
  }, [])

  //Add way better validation later
  async function signUp() {
    setFormError("")
    if (!email || !password) return setFormError("Please type in valid username and password")

    const response = await fetch("/api/signup",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
    if (response.ok) {
      await formSignIn(null)
    }
  }

  async function formSignIn(e: FormEvent<HTMLFormElement> | null) {
    setFormError("")
    e?.preventDefault()
    const res = await signIn(providers!.Credentials.id, { email, password, callbackUrl: "/user", redirect: false })
    if (res?.error) setFormError(res.error)
    if (res?.url) router.push(res.url);
  }

  if (!providers) return <h1>Loading...</h1>

  return (
    <section>
      <button type="button" onClick={() => signIn(providers.Google.id, { callbackUrl: "/user" })}>Google</button>
      <p>or sign in below</p>
      <form onSubmit={formSignIn} className="flex flex-col items-start">
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex">
          <button type="button" onClick={signUp}>Sign Up</button>
          <h1>|</h1>
          <button type="submit">Login</button>
        </div>

      </form>
      <h1>{formError}</h1>
    </section>
  )
}
