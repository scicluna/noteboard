import { connectToDB } from "@/utils/db";
import Board from "@/models/Board";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function GET(req: Request, { params }: Params) {
    const { userid } = params
    connectToDB();
    try {
        console.log(userid)
        const boards = await Board.find({ "ownerid": userid })
        console.log(boards)

        return new Response(JSON.stringify(boards), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify('Failed to find boards'), { status: 500 })
    }
}