import { Note } from "@/components/server/BoardSelector";

export async function newNote(note: Note) {
    const res = await fetch(`/api/note`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) })
    const newNote = await res.json()
    if (!newNote) {
        return null
    }
    return newNote
}