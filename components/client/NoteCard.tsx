'use client'
import { Note } from "../server/BoardSelector"
import { useEffect, useRef, useState } from 'react'
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
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<null | ResizingDirection>(null);
    const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);
    const [options, setOptions] = useState(false)

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!isResizing || !initialMousePos || !resizeDirection) return;

            const deltaX = e.clientX - initialMousePos.x;
            const deltaY = e.clientY - initialMousePos.y;

            let width = parseInt(note.width.replace('px', ''))
            let height = parseInt(note.height.replace('px', ''))
            let left = parseInt(note.left.replace('px', ''))
            let top = parseInt(note.top.replace('px', ''))

            switch (resizeDirection) {
                case "left":
                    // Decrease the width while moving the note to the right
                    width -= deltaX;
                    left += deltaX;
                    break;
                case "right":
                    // Increase the width
                    width += deltaX;
                    break;
                case "top":
                    // Decrease the height while moving the downwards
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "bottom":
                    // Increase the height
                    height += deltaY;
                    break;
                case "top-left":
                    // Decrease the width and height while moving the to the right and downwards
                    width -= deltaX;
                    left += deltaX;
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "top-right":
                    // Increase the width and decrease the height while moving the downwards
                    width += deltaX;
                    height -= deltaY;
                    top += deltaY;
                    break;
                case "bottom-left":
                    // Decrease the width and increase the height while moving the to the right
                    width -= deltaX;
                    left += deltaX;
                    height += deltaY;
                    break;
                case "bottom-right":
                    // Increase both width and height
                    width += deltaX;
                    height += deltaY;
                    break;
                default:
                    return;
            }

            note.width = `${width}px`
            note.height = `${height}px`
            note.left = `${left}px`
            note.top = `${top}px`
            setInitialMousePos({ x: e.clientX, y: e.clientY }); // update for continuous resizing
        }

        function handleMouseUp() {
            setIsResizing(false);
            setResizeDirection(null);
            setInitialMousePos(null);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, initialMousePos, resizeDirection]);

    function handleDragStart(e: React.DragEvent, note: Note) {
        if (isResizing) {
            e.preventDefault();
            return;
        }
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
        if (isResizing) return
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

    function resize(e: React.MouseEvent, direction: ResizingDirection) {

        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
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
                    <ResizingHandle direction="left" onResize={(e) => resize(e, "left")} />
                    <ResizingHandle direction="right" onResize={(e) => resize(e, "right")} />
                    <ResizingHandle direction="top" onResize={(e) => resize(e, "top")} />
                    <ResizingHandle direction="bottom" onResize={(e) => resize(e, "bottom")} />
                    <ResizingHandle direction="top-left" onResize={(e) => resize(e, "top-left")} />
                    <ResizingHandle direction="top-right" onResize={(e) => resize(e, "top-right")} />
                    <ResizingHandle direction="bottom-left" onResize={(e) => resize(e, "bottom-left")} />
                    <ResizingHandle direction="bottom-right" onResize={(e) => resize(e, "bottom-right")} />
                </>
            }
        </div>
    )

}


type ResizingDirection = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

function ResizingHandle({ direction, onResize }: { direction: ResizingDirection, onResize: (e: React.MouseEvent, direction: ResizingDirection) => void }) {
    let cssResize: string = `absolute bg-black w-4 h-4  transform`;
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
            className={`${cssResize} note`}
            onMouseDown={(e) => onResize(e, direction)}
        />
    );
}