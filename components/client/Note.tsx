'use client'
import { Note } from "../server/BoardSelector"
import { useRef, useState } from 'react'
import { updateNoteText } from "@/utils/updateNoteText";

type NoteProps = {
    note: Note;
    isOwner: boolean;
    onDragUpdate: (note: Note, deltaX: number, deltaY: number) => void;
};

export default function NoteCard({ note, isOwner, onDragUpdate }: NoteProps) {
    const dragStartPos = useRef<{ x: number, y: number, tempid: string } | null>(null);
    const [options, setOptions] = useState(false)

    function handleDragStart(e: React.DragEvent, note: Note) {
        dragStartPos.current = { x: e.clientX, y: e.clientY, tempid: note.tempid };
    }

    function handleDragEnd(e: React.DragEvent, note: Note) {
        if (dragStartPos.current) {
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;
            onDragUpdate(note, deltaX, deltaY)
        }
        dragStartPos.current = null
    }

    function optionsToggle() {
        setOptions(true)
    }

    function optionsOff() {
        setOptions(false)
    }


    return (
        <div key={note.tempid} style={{ width: note.width, height: note.height, top: note.top, left: note.left, zIndex: note.zIndex }} className="note absolute" draggable="true" onDragStart={e => handleDragStart(e, note)} onDragEnd={e => handleDragEnd(e, note)} onClick={optionsToggle} onBlur={optionsOff}>
            <textarea data-tempid={note.tempid} defaultValue={note.text} onBlur={(e) => updateNoteText(e, note, isOwner)} className="resize note h-full w-full bg-yellow-300 p-2  rounded-lg" style={{ fontSize: note.fontSize || '20px' }} id={`note-${note.tempid}`} contentEditable suppressContentEditableWarning={true} />
            {options &&
                <div className="absolute top-0 right-2 -translate-y-full bg-gray-400 w-16 h-6">
                    <p>Trash</p>
                </div>
            }
        </div>
    )

}