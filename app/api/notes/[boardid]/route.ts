import { connectToDB } from "@/utils/db";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest } from "next/server";
import Note from "@/models/Note";

export async function GET(req: NextRequest, { params }: Params) {
    const { boardid } = params
    connectToDB()
    try {
        const notes = await Note.find({ boardid })
        return new Response(JSON.stringify(notes), { status: 200 })
    } catch (err) {
        console.log('error')
        return new Response(JSON.stringify('Failed to find notes'), { status: 500 })
    }
}