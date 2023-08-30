import { Note } from "@/components/server/BoardSelector";

export async function updateNoteConnection(noteOne: Note, noteTwo: Note, isOwner: boolean) {
    if (!isOwner) return
    if (noteOne.id === noteTwo.id) return
    await fetch(`/api/note/${noteOne.tempid}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: noteTwo }) })
    await fetch(`/api/note/${noteTwo.tempid}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: noteOne }) })
}