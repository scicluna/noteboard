'use client'
import { Note } from "../server/BoardSelector"
import { useRef, useState } from 'react'
import { updateNoteText } from "@/utils/updateNoteText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { deleteNote } from "@/utils/deleteNote";

type NoteProps = {
    note: Note;
    isOwner: boolean;
    onDragUpdate: (note: Note, deltaX: number, deltaY: number) => void;
    removeNote: (note: Note) => void;
    connectNotes: (note: Note) => void;
    pinning: boolean
};

export default function NoteCard({ note, isOwner, onDragUpdate, removeNote, connectNotes, pinning }: NoteProps) {
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

    function handlePin() {
        connectNotes(note)
    }

    return (
        <div key={note.tempid} style={{ width: note.width, height: note.height, top: note.top, left: note.left, zIndex: note.zIndex }} className="note absolute rounded-lg" draggable="true" onDragStart={e => handleDragStart(e, note)} onDragEnd={e => handleDragEnd(e, note)} onClick={optionsToggle} onBlur={e => optionsOff(e)}>
            <textarea data-tempid={note.tempid} defaultValue={note.text} onBlur={(e) => updateNoteText(e, note, isOwner)} className={`resize note h-full w-full ${pinning ? 'bg-yellow-500' : 'bg-yellow-300'}  p-2  outline outline-black  focus:outline-red-600 focus:outline-4 rounded-lg`} style={{ fontSize: note.fontSize || '20px' }} id={`note-${note.tempid}`} contentEditable suppressContentEditableWarning={true} />
            {options &&
                <>
                    <div className="note absolute -top-1 right-2 -translate-y-full bg-gray-400 bg-opacity-30 w-16 h-6 flex justify-between items-center">
                        <button onClick={handleDelete} className="note">
                            <FontAwesomeIcon icon={faTrash} width={20} height={20} className="note" />
                        </button>
                        <button onClick={handlePin} className="note">
                            <FontAwesomeIcon icon={faMapPin} width={20} height={20} className="note" />
                        </button>
                    </div>
                    <ResizingHandle direction="left" onResize={() => { }} />
                    <ResizingHandle direction="right" onResize={() => { }} />
                    <ResizingHandle direction="top" onResize={() => { }} />
                    <ResizingHandle direction="bottom" onResize={() => { }} />
                    <ResizingHandle direction="top-left" onResize={() => { }} />
                    <ResizingHandle direction="top-right" onResize={() => { }} />
                    <ResizingHandle direction="bottom-left" onResize={() => { }} />
                    <ResizingHandle direction="bottom-right" onResize={() => { }} />
                </>
            }
        </div>
    )

}


type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

function ResizingHandle({ direction, onResize }: { direction: ResizingDirection, onResize: (direction: ResizingDirection, deltaX: number, deltaY: number) => void }) {
    const handleDragStart = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const originalX = e.clientX;
        const originalY = e.clientY;

        const handleMouseMove = (ev: MouseEvent) => {
            const deltaX = ev.clientX - originalX;
            const deltaY = ev.clientY - originalY;
            onResize(direction, deltaX, deltaY);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    let cssResize: string = `absolute bg-black w-2 h-2 transform`;
    switch (direction) {
        case "left": {
            cssResize += ` -left-3 top-1/2 -translate-y-1/2 cursor-ew-resize`;
            break;
        }
        case "right": {
            cssResize += ` -right-3 top-1/2 -translate-y-1/2 cursor-ew-resize`;
            break;
        }
        case "top": {
            cssResize += ` left-1/2 -top-3 -translate-x-1/2 cursor-ns-resize`;
            break;
        }
        case "bottom": {
            cssResize += ` left-1/2 -bottom-3 -translate-x-1/2 cursor-ns-resize`;
            break;
        }
        case "top-left": {
            cssResize += ` -left-3 -top-3 cursor-nwse-resize`;
            break;
        }
        case "top-right": {
            cssResize += ` -right-3 -top-3 cursor-nesw-resize`;
            break;
        }
        case "bottom-left": {
            cssResize += ` -left-3 -bottom-3 cursor-nesw-resize`;
            break;
        }
        case "bottom-right": {
            cssResize += ` -right-3 -bottom-3 cursor-nwse-resize`;
            break;
        }
        default: return "";
    }

    return (
        <div
            className={cssResize}
            draggable="true"
            onDragStart={handleDragStart}
        />
    );
}