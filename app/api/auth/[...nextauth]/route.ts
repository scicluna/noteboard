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

                const user = await User.findOne({
                    email: credentials.email
                })
                if (!user) {
                    console.error("User not found.")
                    return null
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password)

                if (!passwordMatch) {
                    console.error("Invalid password")
                    return null
                }

                return user
            }
        })
    ],
    callbacks: {
        async session({ session }) {
            return session
        },
        async signIn({ profile, user }) {
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
                console.error(err)
                return false
            }
        }
    }
})
export { handler as GET, handler as POST }