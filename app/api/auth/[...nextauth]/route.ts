import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDB } from "@/utils/db";
import User from "@/models/User";
import bcrypt from 'bcrypt'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            id: "Google",
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null
                await connectToDB()

                try {
                    const user = await User.findOne({
                        email: credentials.email
                    })

                    if (!user) {
                        throw new Error('No user Found With Email Please Sign Up!')
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password)

                    if (!passwordMatch) {
                        throw new Error("Email or Password doesn't match")
                    }

                    return user
                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks: {
        async session({ session }) {
            return session
        },
        async jwt({ token, user }) {
            return token
        },
        async signIn({ profile, user }: any) {
            try {
                if (!profile && !user) return false
                await connectToDB()

                const userOrProfile = profile || user

                const userExists = await User.findOne({
                    email: userOrProfile.email
                })

                if (!userExists) {
                    await User.create({
                        email: userOrProfile.email,
                        nickname: userOrProfile?.name,
                        image: userOrProfile?.image
                    })
                }
                return true
            } catch (err) {
                return false
            }
        }
    }
})
export { handler as GET, handler as POST }