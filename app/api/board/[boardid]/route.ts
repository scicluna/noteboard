import { connectToDB } from "@/utils/db";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest } from "next/server";
import Board from "@/models/Board";

export async function GET(req: NextRequest, { params }: Params) {
    const { boardid } = params
    connectToDB()
    try {
        const board = await Board.findById(boardid)
        return new Response(JSON.stringify(board.name), { status: 200 })
    } catch (err) {
        console.log('error')
        return new Response(JSON.stringify('Failed to find board'), { status: 500 })
    }
}