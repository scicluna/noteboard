import { connectToDB } from "@/utils/db";
import User from "@/models/User";

export async function POST(req: Request) {
    const parsedReq = await req.json()
    const { email, password } = parsedReq

    try {
        await connectToDB()

        const userExists = await User.findOne({ email })

        if (userExists) {
            if (!userExists.password) {
                userExists.password = password;
                await userExists.save();
                return new Response('Password set', { status: 200 })
            } else {
                return new Response('User Already Exists', { status: 409 })
            }
        } else {
            const response = await User.create({ email, password })
            return new Response(JSON.stringify(response), { status: 200 })
        }
    } catch (err) {
        return new Response('Sign up failed', { status: 500 })
    }
}