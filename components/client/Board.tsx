'use client'
import { BoardUser } from "../server/BoardSelector"
import { useRef, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { saveNote } from "@/utils/saveNote";
import { Note } from "../server/BoardSelector";

type BoardProps = {
    notes: Note[]
    user: BoardUser
    ownerid: string
    name: string
    boardid: string
}

export default function Board({ notes, user, ownerid, name, boardid }: BoardProps) {
    const isOwner = user.id == ownerid
    const [visible, setVisible] = useState(false);
    const [postedNotes, setPostedNotes] = useState<Note[] | null>(notes)
    const [newNote, setNewNote] = useState<Note[] | null>(null)
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo((3000 - window.innerWidth) / 2, (3000 - window.innerHeight) / 2)
        setVisible(true)
    }, [])

    function createNote() {
        if (!isOwner) return

        const left = window.scrollX + window.innerWidth / 2;
        const top = window.scrollY + window.innerHeight / 2;

        const note = {
            id: uuidv4(),
            boardid: boardid,
            text: "New note",
            width: "200px",
            height: "100px",
            left: `${left}px`,
            top: `${top}px`,
        }

        if (!newNote) {
            setNewNote([note])
        } else {
            setNewNote([...newNote, note])
        }

        saveNote(note)
    }

    return (
        <>
            <div className="fixed top-[10dvh] w-full h-20 bg-gray-400 z-30 opacity-80 flex justify-center items-center">
                <button onClick={createNote}>New Note</button>
            </div>
            <section ref={containerRef} className="absolute pt-[10dvh] w-[3250px] h-[3250px] bg-black overflow-auto flex items-center justify-center" style={{ visibility: visible ? 'visible' : 'hidden' }}>
                <section className="absolute w-[3000px] h-[3000px] bg-gray-100">
                    {postedNotes && postedNotes.map(note => (
                        <div key={note.id} style={{ width: note.width, height: note.height, top: note.top, left: note.left }} className="absolute bg-yellow-300">
                            <p>{note.text}</p>
                        </div>
                    ))}
                    {newNote && newNote.map(note => (
                        <div key={note.id} style={{ width: note.width, height: note.height, top: note.top, left: note.left }} className="absolute bg-yellow-300">
                            <p>{note.text}</p>
                        </div>
                    ))}
                </section>
            </section>
        </>
    )
}