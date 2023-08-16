import Note from "@/models/Note"
import { Note as NoteType } from "@/components/server/BoardSelector";
import { connectToDB } from "@/utils/db"
import { NextRequest } from "next/server"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

type parseNote = {
    note: NoteType
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { noteid } = params
    connectToDB()
    try {
        const parsedReq = await req.json()
        const { note }: parseNote = parsedReq

        if (note?.connectedNotes) {
            const updatedNote = await Note.updateOne({ tempid: noteid }, { connectedNotes: [...note.connectedNotes, note] })
            return new Response(JSON.stringify(updatedNote), { status: 200 })
        } else {
            const updatedNote = await Note.updateOne({ tempid: noteid }, { connectedNotes: [note] })
            return new Response(JSON.stringify(updatedNote), { status: 200 })
        }
    } catch (err) {
        console.error("error", err)
        return new Response(JSON.stringify('Failed to update note'), { status: 500 })
    }
}