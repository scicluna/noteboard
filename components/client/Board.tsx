'use client'
import { BoardUser, Note } from "../server/BoardSelector"

type BoardProps = {
    notes: Note[]
    user: BoardUser
    ownerid: string
    name: string
}

export default function Board({ notes, user, ownerid, name }: BoardProps) {

    console.log(notes)
    console.log(user)
    console.log(ownerid)
    console.log(name)

    return (
        <h1>Board</h1>
    )
}