'use client'
import { Note } from "../server/BoardSelector"
import { useRef, useState } from 'react'
import { updateNoteText } from "@/utils/updateNoteText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteNote } from "@/utils/deleteNote";

type NoteProps = {
    note: Note;
    isOwner: boolean;
    onDragUpdate: (note: Note, deltaX: number, deltaY: number) => void;
    removeNote: (note: Note) => void;
};

export default function NoteCard({ note, isOwner, onDragUpdate, removeNote }: NoteProps) {
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

    function optionsOff(e: React.FocusEvent) {
        setTimeout(() => {
            if (document.activeElement && (document.activeElement as HTMLElement).classList.contains('note')) return;
            setOptions(false);
        }, 0);
    }

    function handleDelete() {
        removeNote(note)
        deleteNote(note, isOwner)
    }


    return (
        <div key={note.tempid} style={{ width: note.width, height: note.height, top: note.top, left: note.left, zIndex: note.zIndex }} className="note absolute rounded-lg" draggable="true" onDragStart={e => handleDragStart(e, note)} onDragEnd={e => handleDragEnd(e, note)} onClick={optionsToggle} onBlur={e => optionsOff(e)}>
            <textarea data-tempid={note.tempid} defaultValue={note.text} onBlur={(e) => updateNoteText(e, note, isOwner)} className="resize note h-full w-full bg-yellow-300 p-2  outline outline-black  focus:outline-red-600 focus:outline-4 rounded-lg" style={{ fontSize: note.fontSize || '20px' }} id={`note-${note.tempid}`} contentEditable suppressContentEditableWarning={true} />
            {options &&
                <div className="note absolute -top-1 right-2 -translate-y-full bg-gray-400 bg-opacity-30 w-16 h-6 flex justify-between items-center">
                    <button onClick={handleDelete} className="note">
                        <FontAwesomeIcon icon={faTrash} width={20} height={20} className="note" />
                    </button>
                </div>
            }
        </div>
    )

}