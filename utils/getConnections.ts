import { Note } from "@/components/server/BoardSelector";

export type Connection = {
    noteOne: Note
    noteTwo: Note
}

export function getConnections(notes: Note[]) {
    const connections: Connection[] = [];

    notes.forEach(note => {
        note.connectedNotes?.forEach(connectedNoteId => {
            const connectedNote = notes.find(n => n.tempid === connectedNoteId);
            if (connectedNote) {
                const connection = {
                    noteOne: note,
                    noteTwo: connectedNote
                };
                connections.push(connection);
            }
        });
    });

    return connections
}