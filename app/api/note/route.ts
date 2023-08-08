import { NextRequest } from "next/server";
import { Note as NoteType } from "@/components/server/BoardSelector";
import Note from "@/models/Note";
import { connectToDB } from "@/utils/db";

type parseNote = {
    note: NoteType
}

export async function POST(req: NextRequest) {
    connectToDB()
    try {
        const parsedReq = await req.json()
        const { note }: parseNote = parsedReq

        const newNote = await Note.create({
            tempid: note.tempid,
            boardid: note.boardid,
            text: note.text,
            image: note.image,
            width: note.width,
            height: note.height,
            top: note.top,
            left: note.left,
            zIndex: note.zIndex
        })

        return new Response(JSON.stringify(newNote), { status: 200 })
    } catch (err) {
        console.error("error", err)
        return new Response(JSON.stringify('Failed to create note'), { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    connectToDB()
    try {
        const parsedReq = await req.json()
        const { note }: parseNote = parsedReq

        const updatedNote = await Note.updateOne({ tempid: note.tempid }, { text: note.text, left: note.left, top: note.top, width: note.width, height: note.height, zIndex: note.zIndex })

        return new Response(JSON.stringify(updatedNote), { status: 200 })
    } catch (err) {
        console.error("error", err)
        return new Response(JSON.stringify('Failed to update note'), { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    connectToDB()
    try {
        const parsedReq = await req.json()
        const { note }: parseNote = parsedReq;
        await Note.deleteOne({ tempid: note.tempid })
        return new Response(JSON.stringify('NOTE DELETED'), { status: 200 })
    } catch (err) {
        console.error("error", err)
        return new Response(JSON.stringify('Failed to update note'), { status: 500 })
    }
}