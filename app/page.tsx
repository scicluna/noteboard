'use client'
import { BuiltInProviderType } from "next-auth/providers/index"
import { signIn, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react"
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from "next/navigation"
import Image from "next/image"
import googleIcon from "@/public/images/google.png"

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
    if (!email || !password) return setFormError("Input not valid")

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
    } else {
      const res = await response.json()
      setFormError(res)
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
    <section className="flex flex-col gap-2 items-center w-1/4">
      <button type="button" className="outline-gray-300 outline outline-1 flex justify-center items-center p-2 gap-5 bg-gray-50 hover:shadow-md hover:shadow-gray-400 rounded-md w-full" onClick={() => signIn(providers.Google.id, { callbackUrl: "/user" })}>
        <Image src={googleIcon} alt="google" width={20} height={20} />
        <span>Google</span>
      </button>
      <div className="flex justify-center items-center w-full">
        <hr className="border-gray-400 border-t w-1/6" />
        <p className="mx-1 w-fit text-gray-400 text-xs text-center">Or with email and password</p>
        <hr className="border-gray-400 border-t w-1/6" />
      </div>
      <form onSubmit={formSignIn} className="flex flex-col items-star w-full">
        <label htmlFor="email">Email:</label>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="shadow-sm shadow-black rounded-md bg-gray-100 p-1" />
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="shadow-sm shadow-black rounded-md bg-gray-100 p-1" />
        <div className="flex justify-center items-center w-full gap-[2px]">
          <button type="button" className="text-blue-400 hover:text-blue-300" onClick={signUp}>Sign Up</button>
          <p className="text-blue-400">{" | "}</p>
          <button type="submit" className="text-blue-400 hover:text-blue-300">Login</button>
        </div>
      </form>
      <p className="text-red-600 h-5">{formError}</p>
    </section>
  )
}
