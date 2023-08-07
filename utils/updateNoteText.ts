import { Note } from "@/components/server/BoardSelector";

export async function updateNoteText(e: React.FocusEvent<HTMLTextAreaElement>, note: Note, isOwner: boolean) {
    if (!isOwner) return
    note.text = e.target.value
    const res = await fetch(`/api/note`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) })
    const updatedNote = await res.json()
    if (!updatedNote) {
        return null
    }
    return updatedNote
}