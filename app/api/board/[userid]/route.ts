import { connectToDB } from "@/utils/db";
import Board from "@/models/Board";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function GET(req: Request, { params }: Params) {
    const { userid } = params
    connectToDB();
    try {
        const boards = await Board.find({ "ownerid": userid })
        return new Response(JSON.stringify(boards), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify('Failed to find boards'), { status: 500 })
    }
}

export async function POST(req: Request, { params }: Params) {
    const parsedReq = await req.json()
    const { name } = parsedReq
    const { userid } = params
    connectToDB()
    try {
        const newBoard = await Board.create({
            ownerid: userid,
            name,
        })
        return new Response(JSON.stringify(newBoard), { status: 200 })
    } catch (err) {
        return new Response('Failed to create board', { status: 500 })
    }
}