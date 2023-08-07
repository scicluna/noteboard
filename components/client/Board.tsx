'use client'
import { BoardUser, Note } from "../server/BoardSelector"
import { useRef, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { newNote } from "@/utils/newNote";
import { updateNoteText } from "@/utils/updateNoteText";
import { updateNotePosition } from "@/utils/updateNotePosition";
import { updateNoteSize } from "@/utils/updateNoteSize";


type BoardProps = {
    notes: Note[]
    user: BoardUser
    ownerid: string
    name: string
    boardid: string
}

export default function Board({ notes, user, ownerid, name, boardid }: BoardProps) {
    const [dragging, setDragging] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1)
    const isOwner = user.id == ownerid
    const [visible, setVisible] = useState(false);
    const [allNotes, setAllNotes] = useState<Note[] | null>(notes)
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<{ x: number, y: number, tempid: string } | null>(null);


    useEffect(() => {
        window.scrollTo((3000 - window.innerWidth) / 2, (3000 - window.innerHeight) / 2)
        document.body.style.overflow = 'hidden';
        setVisible(true)
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    useEffect(() => {
        const debouncedUpdate = debounce((width: number, height: number, tempId: string) => {
            const updatedNote = allNotes?.find(note => note.tempid === tempId);

            if (updatedNote && (updatedNote.width != `${width}px` || updatedNote.height != `${height}px`)) {
                console.log(width)
                updatedNote.width = `${width}px`;
                updatedNote.height = `${height}px`;
                setAllNotes([...(allNotes || [])]);
                updateNoteSize(updatedNote, isOwner)
            }
        }, 250);

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const rect = entry.target.getBoundingClientRect();
                const width = rect.width / zoom;
                const height = rect.height / zoom;
                const tempId = entry.target.getAttribute("data-tempid");
                debouncedUpdate(width, height, tempId!);
            }
        });

        allNotes?.forEach(note => {
            const element = document.querySelector(`#note-${note.tempid}`);
            if (element) {
                resizeObserver.observe(element);
            }
        });

        return () => {
            allNotes?.forEach(note => {
                const element = document.querySelector(`#note-${note.tempid}`);
                if (element) {
                    resizeObserver.unobserve(element);
                }
            });
        };
    }, [allNotes]);

    function debounce<T extends any[]>(fn: (...args: T) => void, ms: number): (...args: T) => void {
        let timer: ReturnType<typeof setTimeout> | null;
        return (...args: T): void => {
            clearTimeout(timer as ReturnType<typeof setTimeout>);
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, ms);
        };
    }


    function createNote() {
        if (!isOwner) return
        const left = window.scrollX + window.innerWidth / 2;
        const top = window.scrollY + window.innerHeight / 2;
        const note = {
            tempid: uuidv4(),
            boardid: boardid,
            text: "New note",
            width: "200px",
            height: "100px",
            left: `${left}px`,
            top: `${top}px`,
        }
        if (allNotes) {
            setAllNotes(prevNotes => [...prevNotes!, note]);
        } else {
            setAllNotes([note])
        }
        newNote(note);
    }

    function handleDragStart(e: React.DragEvent, note: Note) {
        dragStartPos.current = { x: e.clientX, y: e.clientY, tempid: note.tempid };
    }

    function handleDragEnd(e: React.DragEvent, note: Note) {
        if (dragStartPos.current) {
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;

            const originalLeft = parseInt(note.left.slice(0, -2));
            const originalTop = parseInt(note.top.slice(0, -2));

            const newLeft = originalLeft + deltaX;
            const newTop = originalTop + deltaY;

            setAllNotes(allNotes!.map((note) => {
                if (note.tempid === dragStartPos.current?.tempid) {
                    return { ...note, left: `${newLeft}px`, top: `${newTop}px` };
                } else {
                    return note;
                }
            }));

            // Update the note's position in the database
            const updatedNote = { ...note, left: `${newLeft}px`, top: `${newTop}px` };
            updateNotePosition(updatedNote, isOwner);
        }
        dragStartPos.current = null; // Reset for next drag
    }

    function handleWheel(event: React.WheelEvent) {
        if (zoom >= 4) {
            event.preventDefault();
            event.stopPropagation();
        }
        let newZoom = zoom - event.deltaY * 0.001;
        newZoom = Math.min(Math.max(.5, newZoom), 4); // Restrict zoom levels between 0.125 to 4
        setZoom(newZoom);
    }

    function handleMouseDown(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('note')) return;
        setDragging(true);
        setMousePos({ x: e.clientX, y: e.clientY });
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (dragging) {
            const dx = e.clientX - mousePos.x;
            const dy = e.clientY - mousePos.y;
            window.scrollTo(window.scrollX - dx, window.scrollY - dy);
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    }

    function handleMouseUp() {
        setDragging(false);
    }

    return (
        <>
            <div className="fixed top-[10dvh] w-full h-20 bg-gray-400 z-30 opacity-80 flex justify-center items-center">
                <button onClick={createNote}>New Note</button>
            </div>
            <section ref={containerRef} className="absolute pt-[10dvh] w-[3250px] h-[3250px] bg-black flex items-center justify-center" style={{ visibility: visible ? 'visible' : 'hidden' }}>
                <section className="absolute w-[3000px] h-[3000px] bg-gray-100 overflow-hidden" style={{ transform: `scale(${zoom})` }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    {allNotes && allNotes.map(note => (
                        <div key={note.tempid} style={{ width: note.width, height: note.height, top: note.top, left: note.left }} className="note absolute" >
                            <textarea data-tempid={note.tempid} defaultValue={note.text} draggable="true" onDragStart={e => handleDragStart(e, note)} onDragEnd={e => handleDragEnd(e, note)} onBlur={(e) => updateNoteText(e, note, isOwner)} className="resize note h-full w-full bg-yellow-300" id={`note-${note.tempid}`} contentEditable suppressContentEditableWarning={true} />
                        </div>
                    ))}
                </section>
            </section>
        </>
    )
}