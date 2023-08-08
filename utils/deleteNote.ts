import { Note } from "@/components/server/BoardSelector";

export async function deleteNote(note: Note, isOwner: boolean) {
    if (!isOwner) return
    await fetch(`/api/note`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) })
}